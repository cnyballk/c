function getVariableType(variable: any): string {
    return Object.prototype.toString.call(variable).match(/\[object (.*?)\]/)![1];
}
export function isObject(obj: any): boolean {
    return getVariableType(obj) === 'Object';
}
