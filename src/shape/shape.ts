import Node, { IAttributes } from '@/base/node';

abstract class Shape extends Node {
    constructor(attr: IAttributes = {}) {
        super({});
        this.attributes = { ...this.attributes, ...attr };
    }
    drawBefore(ctx: CanvasRenderingContext2D) {
        ctx.save();
        super.setAttrsAtContext(ctx, this);
    }
    draw(ctx: CanvasRenderingContext2D) {
        this.drawBefore(ctx);
        this.drawPath(ctx);
        this.drawAfter(ctx);
    }
    drawAfter(ctx: CanvasRenderingContext2D) {
        this.isStroke() && ctx.stroke();
        this.isFill() && ctx.fill();
        ctx.restore();
    }
    isFill() {
        return this.attr('fillStyle');
    }
    isStroke() {
        return this.attr('strokeStyle');
    }
    abstract drawPath(ctx: CanvasRenderingContext2D);
}
export default Shape;
