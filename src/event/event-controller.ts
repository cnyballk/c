import Scene from '@/base/scene';
import Node from '@/base/node';
import vec2 from '@/math/vec2';
import NodeEvent from './node-event';
const EVENTS = ['mousedown', 'mouseup', 'mouseout', 'mouseover', 'mousemove'];

interface IEventControllerProps {
    scene: Scene;
}

class EventController {
    private scene: Scene;
    private dragging: boolean = false;

    private mousedownShape: Node = null;
    private mousedownPoint: vec2 = null;

    private preMovePint: vec2;
    constructor(config: IEventControllerProps) {
        this.scene = config.scene;
        console.log('initEvent');
        console.log(config.scene);
        this.addEventListener();
    }

    private addEventListener() {
        const container = this.scene.get('canvas') as HTMLElement;
        EVENTS.forEach((eventName) => {
            container.addEventListener(eventName, this.eventCallback);
        });
    }

    eventCallback = (evt: Event) => {
        const point = this.scene.computeXY(evt);
        const type = evt.type;
        const node = this.scene.getNodeByPoint(point);
        const method = this[`on${type}`];
        if (method) {
            method(point, node, evt);
        }
    };
    onmousedown = (point: vec2, node: Node, event: MouseEvent) => {
        if (event.button === 0) {
            this.mousedownShape = node;
            this.mousedownPoint = point;
            this.preMovePint = point;
        }
        this.emitEvent('mousedown', event, point, node);
    };
    onmousemove = (point: vec2, node: Node, event: MouseEvent) => {
        if (this.mousedownPoint && this.mousedownShape) {
            this.dragging = true;
            this.emitEvent('drag', event, point, this.mousedownShape);
            this.preMovePint = point;
        } else {
            this.dragging = false;
            this.emitEvent('mousemove', event, point, node);
        }
        this.scene.setCursor(node);
    };
    onmouseup = (point: vec2, node: Node, event: MouseEvent) => {
        this.mousedownPoint = null;
        this.mousedownShape = null;
        this.emitEvent('mouseup', event, point, node);
    };

    emitEvent(type: string, event: Event, point: vec2, node: Node) {
        const nodeEvent = new NodeEvent(type, event);
        nodeEvent.x = point.x;
        nodeEvent.y = point.y;
        if (this.dragging) {
            nodeEvent.dx = point.x - this.preMovePint.x;
            nodeEvent.dy = point.y - this.preMovePint.y;
        }
        if (node) {
            nodeEvent.propagationPath.push(node);
            this._emitEvent(node, type, nodeEvent);
            let parent = node.get('parent');
            while (parent) {
                if (!nodeEvent.propagationStopped) {
                    this._emitEvent(parent, type, nodeEvent);
                }
                nodeEvent.propagationPath.push(parent);
                parent = parent.get('parent');
            }
        } else {
            nodeEvent.propagationPath.push(this.scene);
            this._emitEvent(this.scene, type, nodeEvent);
        }
    }
    _emitEvent(target: Node, type: string, eventObj: NodeEvent) {
        eventObj.name = type;
        eventObj.target = target;
        eventObj.currentTarget = target;
        target.emit(type, eventObj);
    }
}

export default EventController;
