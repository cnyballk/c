export const PiBy180: number = 0.017453292519943295; // PI  / 180
export const EPSILON: number = 0.00001; //浮点数误差

export default {
    isEquals: function (left: number, right: number, espilon: number = EPSILON): boolean {
        if (Math.abs(left - right) >= espilon) {
            return false;
        }
        return true;
    },
    toDegree: function (radian: number): number {
        return radian / PiBy180;
    },
};
