import utils from './utils';
import { EPSILON } from './utils';

class vec2 {
    public values: Float32Array;

    public constructor(x: number = 0, y: number = 0) {
        this.values = new Float32Array([x, y]);
    }

    public get x(): number {
        return this.values[0];
    }
    public set x(x: number) {
        this.values[0] = x;
    }

    public get y(): number {
        return this.values[1];
    }
    public set y(y: number) {
        this.values[1] = y;
    }
    /**
     * 设置x，y值
     */
    public reset(x: number = 0, y: number): vec2 {
        this.x = x;
        this.y = y;
        return this;
    }
    /**
     * 判断两个向量是否相等
     */
    public equals(vector: vec2): boolean {
        if (Math.abs(this.x - vector.x) > EPSILON) return false;

        if (Math.abs(this.y - vector.y) > EPSILON) return false;

        return true;
    }
    /**
     * 设置成相反向量
     */
    public negative(): vec2 {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    /**
     * 开平方之前的值
     */
    public get squaredLength(): number {
        let x = this.x;
        let y = this.y;
        return x * x + y * y;
    }
    /**
     * 向量长度
     */
    public get length(): number {
        return Math.sqrt(this.squaredLength);
    }
    /**
     * 设置成单位向量，并且返回原来的长度
     */
    public normalize(): number {
        let len: number = this.length;
        if (utils.isEquals(len, 0)) {
            console.log(' the length = 0 ');
            this.x = 0;
            this.y = 0;
            return 0;
        }

        if (utils.isEquals(len, 1)) {
            console.log(' the length = 1 ');
            return 1.0;
        }

        this.x /= len;
        this.y /= len;
        return len;
    }

    public add(right: vec2): vec2 {
        vec2.sum(this, right, this);
        return this;
    }

    public static sum(left: vec2, right: vec2, result: vec2 | null = null): vec2 {
        if (result === null) result = new vec2();
        result.x = left.x + right.x;
        result.y = left.y + right.y;
        return result;
    }

    public substract(another: vec2): vec2 {
        vec2.difference(this, another, this);
        return this;
    }

    public static difference(end: vec2, start: vec2, result: vec2 | null = null): vec2 {
        if (result === null) result = new vec2();
        result.x = end.x - start.x;
        result.y = end.y - start.y;
        return result;
    }

    public static copy(src: vec2, result: vec2 | null = null): vec2 {
        if (result === null) result = new vec2();
        result.x = src.x;
        result.y = src.y;
        return result;
    }

    public static scale(direction: vec2, scalar: number, result: vec2 | null = null): vec2 {
        if (result === null) result = new vec2();
        result.x = direction.x * scalar;
        result.y = direction.y * scalar;
        return result;
    }

    public static scaleAdd(start: vec2, direction: vec2, scalar: number, result: vec2 | null = null): vec2 {
        if (result === null) result = new vec2();
        vec2.scale(direction, scalar, result);
        return vec2.sum(start, result, result);
    }

    public static moveTowards(start: vec2, direction: vec2, scalar: number, result: vec2 | null = null): vec2 {
        if (result === null) result = new vec2();
        vec2.scale(direction, scalar, result);
        return vec2.sum(start, result, result);
    }

    /**
     * 内积
     */
    public innerProduct(right: vec2): number {
        return vec2.dotProduct(this, right);
    }
    /**
     * 点积
     */
    public static dotProduct(left: vec2, right: vec2): number {
        return left.x * right.x + left.y * right.y;
    }
    /**
     * 叉乘
     */
    public static crossProduct(left: vec2, right: vec2): number {
        return left.x * right.y - left.y * right.x;
    }
    /**
     * 获取朝向
     */
    public static getOrientation(from: vec2, to: vec2, isRadian: boolean = false): number {
        let diff: vec2 = vec2.difference(to, from);
        let radian = Math.atan2(diff.y, diff.x);
        if (isRadian === false) {
            radian = utils.toDegree(radian);
        }
        return radian;
    }
    /**
     * 获取两个向量的夹角  (1 - dt * dt)
     */
    public static getAngle(a: vec2, b: vec2, isRadian: boolean = false): number {
        let dot: number = vec2.dotProduct(a, b);
        let radian: number = Math.acos(dot / (a.length * b.length));
        if (isRadian === false) {
            radian = utils.toDegree(radian);
        }
        return radian;
    }

    public static cosAngle(a: vec2, b: vec2, norm: boolean = false): number {
        if (norm === true) {
            a.normalize();
            b.normalize();
        }
        return vec2.dotProduct(a, b);
    }

    public static sinAngle(a: vec2, b: vec2, norm: boolean = false): number {
        if (norm === true) {
            a.normalize();
            b.normalize();
        }
        return a.x * b.y - b.x * a.y;
    }
}

export default vec2;
