import Shape from './shape';

class Rect extends Shape {
    drawPath(ctx: CanvasRenderingContext2D): void {
        ctx.strokeRect(0, 0, this.attr('width'), this.attr('height'));
    }
}
export default Rect;
