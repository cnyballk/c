import Group, { IGroupConfig } from './group';
import vec2 from '@/math/vec2';
import EventController from '@/event/event-controller';
import Node from './node';

export interface IScenceConfig extends IGroupConfig {
    /**
     * canvas 容器id
     */
    container?: string | HTMLElement;
    canvas?: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    pixelRatio?: number;
    eventController: EventController;

    hitCanvas?: HTMLCanvasElement;
    hitCtx: CanvasRenderingContext2D;
    autoDraw?: boolean;
    drawAnimationFrame: number;
}
class Scene extends Group<IScenceConfig> {
    constructor(config: IScenceConfig) {
        super(config);
        this.initDom();
        this.initCanvas();
        this.initHitCanvas();
        this.initEvent();
    }
    setDefaultConfig() {
        super.setDefaultConfig();
        console.log(this.config);

        this.config = {
            autoDraw: true,
            ...this.config,
        } as IScenceConfig;
    }
    initDom() {
        let container = this.get('container');
        if (typeof container === 'string') {
            container = document.getElementById(container);
            this.set('container', container);
        }
        if (!container) {
            container = document.querySelector('body');
            this.set('container', container);
        }
    }
    initCanvas() {
        const canvas = document.createElement('canvas');
        this.set('canvas', canvas);

        const ctx = canvas.getContext('2d');
        this.set('ctx', ctx);

        const container = this.get('container') as HTMLElement;
        container.appendChild(canvas);

        this.setCanvasSize(canvas, this.get('width'), this.get('height'));
    }
    initHitCanvas() {
        const canvas = document.createElement('canvas');
        this.set('hitCanvas', canvas);

        const ctx = canvas.getContext('2d');
        this.set('hitCtx', ctx);

        this.setCanvasSize(canvas, 1, 1);
    }
    initEvent() {
        const eventController = new EventController({
            scene: this,
        });
        this.set('eventController', eventController);
    }
    /**
     * 获取屏幕像素比
     */
    getPixelRatio() {
        const pixelRatio = this.get('pixelRatio') || window.devicePixelRatio || 1;
        return pixelRatio >= 1 ? Math.floor(pixelRatio) : 1;
    }

    setCanvasSize(canvas: HTMLCanvasElement, width: number, height: number) {
        const ctx = canvas.getContext('2d');
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        const pixelRatio = this.getPixelRatio();
        canvas.width = pixelRatio * width;
        canvas.height = pixelRatio * height;
        if (pixelRatio > 1) {
            ctx.scale(pixelRatio, pixelRatio);
        }
    }

    getClientByEvent(ev: Event) {
        let clientInfo: MouseEvent | Touch = ev as MouseEvent;
        if ((ev as TouchEvent).touches || (ev as TouchEvent).changedTouches) {
            if (ev.type === 'touchend') {
                clientInfo = (ev as TouchEvent).changedTouches[0];
            } else {
                clientInfo = (ev as TouchEvent).touches[0];
            }
        }
        return {
            x: clientInfo.clientX,
            y: clientInfo.clientY,
        };
    }
    computeXY(evt: Event): vec2 {
        const rect = this.get('canvas').getBoundingClientRect();
        const clientInfo = this.getClientByEvent(evt);

        const decl = window.getComputedStyle(evt.target as HTMLElement);
        const borderLeftWidth = parseInt(decl.borderLeftWidth, 10);
        const borderTopWidth = parseInt(decl.borderTopWidth, 10);
        const paddingLeft = parseInt(decl.paddingLeft, 10);
        const paddingTop = parseInt(decl.paddingTop, 10);

        const x = clientInfo.x - rect.left - borderLeftWidth - paddingLeft;
        const y = clientInfo.y - rect.top - borderTopWidth - paddingTop;

        return new vec2(x, y);
    }
    getNodeByPoint(point: vec2): Node {
        const canvas = this.get('hitCanvas');
        const ctx = this.get('hitCtx');
        const children = this.getChildren();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        this.translate(-point.x, -point.y);
        super.setAttrsAtContext(ctx, this);
        const child = super.getNode(ctx, children);
        this.translate(point.x, point.y);
        ctx.restore();
        return child;
    }
    setCursor(node?: Node): void {
        try {
            const canvas = this?.get('canvas');
            const parent = node?.get('parent');
            const cursor = node?.attr('cursor');
            if (cursor) {
                canvas.style.cursor = cursor;
            } else if (parent) {
                this.setCursor(parent);
            } else {
                canvas.style.cursor = 'default';
            }
        } catch (e) {
            console.error(e);
        }
    }
    draw() {
        const drawAnimationFrame = this.get('drawAnimationFrame');
        if (this.get('autoDraw') && drawAnimationFrame) {
            return;
        }
        this.startDraw();
    }
    _draw() {
        const canvas = this.get('canvas');
        const ctx = this.get('ctx');
        const children = this.getChildren();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        super.setAttrsAtContext(ctx, this);
        super.drawChildren(ctx, children);
        ctx.restore();
    }
    // 触发绘制
    startDraw() {
        let drawAnimationFrame = this.get('drawAnimationFrame');
        if (!drawAnimationFrame) {
            drawAnimationFrame = requestAnimationFrame(() => {
                this._draw();
                this.set('drawAnimationFrame', null);
                if (this.get('autoDraw')) {
                    this.draw();
                }
            });
            this.set('drawAnimationFrame', drawAnimationFrame);
        }
    }
}
export default Scene;
