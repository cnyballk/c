import vec2 from './vec2';
import utils from './utils';

/**
 * 2d仿射矩阵
 */
class Matrix2D {
    public values: Float32Array;

    public constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1, x: number = 0, y: number = 0) {
        this.values = new Float32Array([a, b, c, d, x, y]);
    }
    /**
     * 设置成单位矩阵
     */
    public identity(): void {
        this.values[0] = this.values[3] = 1.0;
        this.values[1] = this.values[2] = this.values[4] = this.values[5] = 0.0;
    }

    public copy(mtx: Matrix2D): Matrix2D {
        this.values[0] = mtx.values[0];
        this.values[1] = mtx.values[1];
        this.values[2] = mtx.values[2];
        this.values[3] = mtx.values[3];
        this.values[4] = mtx.values[4];
        this.values[5] = mtx.values[5];
        return this;
    }

    public setTransform(x: number, y: number, rotation: number, scaleX: number, scaleY: number): Matrix2D {
        const result = new Matrix2D();
        this.multiply(Matrix2D.makeTranslation(x, y, result));
        this.multiply(Matrix2D.makeRotation(rotation, result));
        this.multiply(Matrix2D.makeScale(scaleX, scaleY, result));
        return this;
    }

    /**
     * 矩阵乘法
     */
    public multiply(right: Matrix2D): Matrix2D {
        let a0: number = this.values[0];
        let a1: number = this.values[1];
        let a2: number = this.values[2];
        let a3: number = this.values[3];
        let a4: number = this.values[4];
        let a5: number = this.values[5];

        let b0: number = right.values[0];
        let b1: number = right.values[1];
        let b2: number = right.values[2];
        let b3: number = right.values[3];
        let b4: number = right.values[4];
        let b5: number = right.values[5];

        this.values[0] = a0 * b0 + a2 * b1;
        this.values[1] = a1 * b0 + a3 * b1;
        this.values[2] = a0 * b2 + a2 * b3;
        this.values[3] = a1 * b2 + a3 * b3;
        this.values[4] = a0 * b4 + a2 * b5 + a4;
        this.values[5] = a1 * b4 + a3 * b5 + a5;
        return this;
    }

    /**
     * 获取行列式
     */
    public determinant(): number {
        return this.values[0] * this.values[3] - this.values[2] * this.values[1];
    }

    /**
     * 求逆矩阵
     */
    public invert(): boolean {
        const result = new Matrix2D();
        let det: number = this.determinant();
        if (utils.isEquals(det, 0)) {
            return false;
        }
        det = 1.0 / det;
        result.values[0] = this.values[3] * det;
        result.values[1] = -this.values[1] * det;
        result.values[2] = -this.values[2] * det;
        result.values[3] = this.values[0] * det;
        result.values[4] = (this.values[2] * this.values[5] - this.values[3] * this.values[4]) * det;
        result.values[5] = (this.values[1] * this.values[4] - this.values[0] * this.values[5]) * det;
        return true;
    }

    /**
     * 设置旋转系数
     */
    public static makeRotation(radians: number, result: Matrix2D): Matrix2D {
        let s: number = Math.sin(radians),
            c: number = Math.cos(radians);
        result.values[0] = c;
        result.values[1] = s;
        result.values[2] = -s;
        result.values[3] = c;
        result.values[4] = 0;
        result.values[5] = 0;
        return result;
    }
    /**
     * 设置旋转的逆矩阵
     */
    public onlyRotationMatrixInvert(): Matrix2D {
        let s: number = this.values[1];
        this.values[1] = this.values[2];
        this.values[2] = s;
        return this;
    }

    /**
     * 根据两个向量获取旋转矩阵
     * @param v1
     * @param v2
     * @param norm
     */
    public static makeRotationFromVectors(v1: vec2, v2: vec2, norm: boolean = false, result: Matrix2D): Matrix2D {
        result.values[0] = vec2.cosAngle(v1, v2, norm);
        result.values[1] = vec2.sinAngle(v1, v2, norm);
        result.values[2] = -vec2.sinAngle(v1, v2, norm);
        result.values[3] = vec2.cosAngle(v1, v2, norm);
        result.values[4] = 0;
        result.values[5] = 0;
        return result;
    }

    public static makeReflection(axis: vec2, result: Matrix2D): Matrix2D {
        result.values[0] = 1 - 2 * axis.x * axis.x;
        result.values[1] = -2 * axis.x * axis.y;
        result.values[2] = -2 * axis.x * axis.y;
        result.values[3] = 1 - 2 * axis.y * axis.y;
        result.values[4] = 0;
        result.values[5] = 0;
        return result;
    }
    /**
     * x轴旋转
     * @param sx
     */
    public static makeXSkew(sx: number, result: Matrix2D): Matrix2D {
        result.values[0] = 1;
        result.values[1] = 0;
        result.values[2] = sx;
        result.values[3] = 1;
        result.values[4] = 0;
        result.values[5] = 0;
        return result;
    }
    /**
     * y轴旋转
     * @param sx
     */
    public static makeYSkew(sy: number, result: Matrix2D): Matrix2D {
        result.values[0] = 1;
        result.values[1] = sy;
        result.values[2] = 0;
        result.values[3] = 1;
        result.values[4] = 0;
        result.values[5] = 0;
        return result;
    }
    /**
     * 设置偏移系数
     * @param tx
     * @param ty
     */
    public static makeTranslation(tx: number, ty: number, result: Matrix2D): Matrix2D {
        result.values[0] = 1;
        result.values[1] = 0;
        result.values[2] = 0;
        result.values[3] = 1;
        result.values[4] = tx;
        result.values[5] = ty;
        return result;
    }

    public static makeScale(sx: number, sy: number, result: Matrix2D): Matrix2D {
        if (utils.isEquals(sx, 0) || utils.isEquals(sy, 0)) {
            throw new Error(' x轴或y轴缩放系数为0 ');
        }

        result.values[0] = sx;
        result.values[1] = 0;
        result.values[2] = 0;
        result.values[3] = sy;
        result.values[4] = 0;
        result.values[5] = 0;
        return result;
    }
}
export default Matrix2D;
