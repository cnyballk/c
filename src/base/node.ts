import EL from '@/event/listener';
import { isObject } from '@/utils';
import Group from './group';
import Matrix2D from '@/math/matrix2d';

export interface INodeConfig {
    //是否可见
    visible?: boolean;
    parent?: Group | null;
    totalMatrix?: Matrix2D | null;
    parentMatrix?: Matrix2D | null;
}
export interface IAttributes extends ILooseObject {
    //是否可见
    visible?: boolean;
    parent?: Group | null;
}
//fix::暂时允许使用宽松的类型
interface ILooseObject {
    [key: string]: any;
}
/**
 * 图形基础节点 抽象基类
 */
abstract class Node<T extends INodeConfig = INodeConfig> extends EL {
    //记录节点是否销毁了，fix::因为后续做动画的时候，此节点有可能在动画里
    destroyed: boolean;
    //fix::先采用这样的使用方法 方便操作，后期再优化
    //自身的属性
    config: T;
    //图形属性
    attributes: IAttributes;

    constructor(config: T) {
        super();
        this.config = config;
        this.setDefaultConfig();
        this.setDefaultAttributes();
    }

    get<K extends keyof T>(name: K) {
        return this.config[name];
    }
    set<K extends keyof T>(name: K, value: T[K]) {
        this.config[name] = value;
    }

    setDefaultConfig() {
        this.config = { visible: true, ...this.config } as T;
    }
    setDefaultAttributes() {
        this.attributes = {
            x: 0,
            y: 0,
            rotation: 0,
            skewX: 0,
            skewY: 0,
            originX: 0,
            originY: 0,
            tx: 0,
            ty: 0,
            scaleX: 1,
            scaleY: 1,
            matrix: new Matrix2D(),
            ...this.attributes,
        };
    }
    //用于获取/设置图形的属性
    attr(...args) {
        const [name, value] = args;
        if (!name) return this.attributes;
        if (isObject(name)) {
            for (const k in name) {
                this.setAttr(k, name[k]);
            }
            return this;
        }
        if (args.length === 2) {
            this.setAttr(name, value);
            return this;
        }
        return this.attributes[name];
    }
    setAttr(name: string, newValue) {
        const oldValue = this.attributes[name];
        if (oldValue !== newValue) {
            this.attributes[name] = newValue;
            this.onAttrChange(name, newValue, oldValue);
        }
    }
    onAttrChange(name: string, newValue, oldValue) {
        if (name === 'matrix') {
            this.set('totalMatrix', null);
        }
    }
    getMatrix(): Matrix2D {
        return this.attr('matrix');
    }
    setMatrix(m: Matrix2D) {
        this.attr('matrix', m);
    }
    getTotalMatrix() {
        let totalMatrix = this.get('totalMatrix');
        if (!totalMatrix) {
            const currentMatrix = this.getMatrix();
            const parentMatrix = this.get('parentMatrix');
            if (parentMatrix && currentMatrix) {
                const result = new Matrix2D();
                result.multiply(parentMatrix).multiply(currentMatrix);
                totalMatrix = result;
            } else {
                totalMatrix = currentMatrix || parentMatrix;
            }
            this.set('totalMatrix', totalMatrix);
        }
        return totalMatrix;
    }
    applyMatrix(matrix: Matrix2D) {
        const currentMatrix = this.getMatrix();
        let totalMatrix = null;
        if (matrix && currentMatrix) {
            const result = new Matrix2D();
            result.multiply(matrix).multiply(currentMatrix);
            totalMatrix = result;
        } else {
            totalMatrix = currentMatrix || matrix;
        }
        this.set('totalMatrix', totalMatrix);
        this.set('parentMatrix', matrix);
    }
    translate(tx: number = 0, ty: number = 0) {
        const matrix = this.getMatrix();
        const newMatrix = new Matrix2D();
        Matrix2D.makeTranslation(tx, ty, newMatrix).multiply(matrix);
        this.setMatrix(newMatrix);
        this.attr('x', tx);
        this.attr('y', ty);
        return this;
    }
    moveTo(targetX: number, targetY: number) {
        const x = this.attr('x') || 0;
        const y = this.attr('y') || 0;
        this.translate(targetX - x, targetY - y);
        return this;
    }
    scale(sx: number, sy: number = 1) {
        const matrix = this.getMatrix();
        const newMatrix = new Matrix2D();
        Matrix2D.makeScale(sx, sy, newMatrix).multiply(matrix);
        this.setMatrix(newMatrix);
        return this;
    }
    rotate(radian: number) {
        const matrix = this.getMatrix();
        const newMatrix = new Matrix2D();
        Matrix2D.makeRotation(radian, newMatrix).multiply(matrix);
        this.setMatrix(newMatrix);
        return this;
    }
    setAttrsAtContext(ctx: CanvasRenderingContext2D, node: Node) {
        const attrs = node.attr();
        for (const name in attrs) {
            let v = attrs[name];
            if (name === 'matrix' && v) {
                ctx.transform(v.values[0], v.values[1], v.values[2], v.values[3], v.values[4], v.values[5]);
            } else if (name === 'lineDash' && ctx.setLineDash) {
                ctx.setLineDash(v);
            } else {
                if (name === 'globalAlpha') {
                    v = v * ctx.globalAlpha;
                }
                ctx[name] = v;
            }
        }
    }
    getName() {
        return this.constructor.name;
    }

    show() {
        this.set('visible', true);
        return this;
    }
    hide() {
        this.set('visible', false);
        return this;
    }
    isVisible() {
        return this.get('visible');
    }
    isGroup() {
        return false;
    }
    abstract draw(context: CanvasRenderingContext2D);
    destroy() {
        //销毁事件
        this.off();
        this.destroyed = true;
    }
}
export default Node;
