import Node, { INodeConfig } from './node';
import Matrix2D from '@/math/matrix2d';
export interface IGroupConfig extends INodeConfig {
    /**
     * children 子元素
     */
    children: Node[];
}
class Group<T extends IGroupConfig = IGroupConfig> extends Node<T> {
    setDefaultConfig() {
        super.setDefaultConfig();
        this.config = {
            ...this.config,
            children: [],
        } as T;
    }
    /**
     * 添加
     * @param child 节点数组
     */
    add(...childs: Node[]): Group {
        childs.forEach((e: Node) => {
            const parent = e.get('parent');
            parent && parent.removeAt(parent.getChildren().indexOf(e));
            this.getChildren().push(e);
            e.set('parent', this);
            this._applyMatrix(e);
        });
        return this;
    }

    /**
     * 删除指定节点
     * @param child 节点
     */
    remove(child: Node): boolean {
        const index = this.getIndexbyNode(child);
        if (index !== -1) {
            this.removeAt(index);
            return true;
        }
        return false;
    }
    /**
     * 往指定下标的位置添加节点 一般用于调整节点的层次
     * @param child 节点
     * @param index 下标
     */
    addAt(child: Node, index: number): Group {
        const parent = child.get('parent');
        parent && parent.removeAt(parent.getChildren().indexOf(child));
        child.set('parent', this);
        this.getChildren().splice(index, 0, child);
        this._applyMatrix(child);
        return this;
    }
    /**
     * 删除指定下标的节点
     * @param index 下标
     */
    removeAt(index: number): void {
        const child = this.getChildren()[index];
        if (child) {
            child.set('parent', null);
        }
        this.getChildren().splice(index, 1);
    }
    /**
     * 获取指定下标的节点
     * @param index 下标
     */
    getNodebyIndex(index: number): Node {
        return this.getChildren()[index];
    }
    /**
     * 获取节点的下标
     * @param node 节点
     */
    getIndexbyNode(node: Node): number {
        return this.getChildren().indexOf(node);
    }
    /**
     * 移除所有的节点
     */
    removeAll(): void {
        for (let i = this.length - 1; i >= 0; i--) {
            this.removeAt(i);
        }
    }
    /**
     * children的长度挂在 Group 上
     */
    get length(): number {
        return this.getChildren().length;
    }
    getChildren() {
        return this.get('children');
    }
    isGroup() {
        return true;
    }
    destroy() {
        this.removeAll();
        this.get('parent') && super.destroy();
    }
    onAttrChange(name: string, newValue, oldValue) {
        super.onAttrChange(name, newValue, oldValue);
        if (name === 'matrix') {
            const totalMatrix = this.getTotalMatrix();
            this._applyChildrenMarix(totalMatrix);
        }
    }
    _applyChildrenMarix(totalMatrix) {
        const children = this.getChildren();
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            child.applyMatrix(totalMatrix);
        }
    }
    applyMatrix(matrix: Matrix2D) {
        const preTotalMatrix = this.getTotalMatrix();
        super.applyMatrix(matrix);
        const totalMatrix = this.getTotalMatrix();
        if (totalMatrix === preTotalMatrix) {
            return;
        }
        this._applyChildrenMarix(totalMatrix);
    }
    _applyMatrix(node: Node) {
        const totalMatrix = this.getTotalMatrix();
        if (totalMatrix) {
            node.applyMatrix(totalMatrix);
        }
    }
    drawChildren(ctx: CanvasRenderingContext2D, children: Node[]) {
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.get('visible')) {
                child.draw(ctx);
            }
        }
    }
    draw(ctx: CanvasRenderingContext2D) {
        super.setAttrsAtContext(ctx, this);
        const children = this.getChildren();
        this.drawChildren(ctx, children);
    }

    getNode(ctx: CanvasRenderingContext2D, children: Node[]): Node {
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.get('visible')) {
                if (child.isGroup()) {
                    child.setAttrsAtContext(ctx, child);
                    const _children = (child as Group).getChildren();
                    const _child = (child as Group).getNode(ctx, _children);
                    if (_child) {
                        return _child;
                    }
                } else {
                    child.draw(ctx);
                    if (ctx.getImageData(0, 0, 1, 1).data[3] > 0) {
                        return child;
                    }
                }
            }
        }
    }
}
export default Group;
