import NodeEvent from './node-event';

export interface IListenerRecord {
    callback: Function;
    once: boolean;
}
export interface IListeners {
    [key: string]: IListenerRecord[];
}
/**
 * 事件监听器
 */
class EventListenter {
    //缓存的监听的Map
    private _listeners: IListeners = {};

    /**
     * 将回调函数进行监听
     * @param eventType 事件的类型
     * @param callback 监听的回调函数
     * @param once 是否只触发一次
     */
    on(eventType: string, callback: Function, once: boolean) {
        if (!this._listeners[eventType]) {
            this._listeners[eventType] = [
                {
                    callback: callback,
                    once: !!once,
                },
            ];
        } else {
            this._listeners[eventType].push({
                callback: callback,
                once: !!once,
            });
        }
        return this;
    }
    /**
     * 监听一个事件一次
     */
    once(eventType: string, callback: Function) {
        return this.on(eventType, callback, true);
    }
    off(eventType?: string, callback?: Function) {
        //如果不传参数则全部清空
        if (arguments.length === 0) {
            this._listeners = {};
        } else if (arguments.length === 1) {
            this._listeners[eventType] = [];
        } else {
            const listens = this._listeners[eventType];
            if (listens) {
                this._listeners[eventType] = listens.filter((listen) => callback !== listen.callback);
            }
        }
        return this;
    }
    //通知派发事件
    emit(eventType: string, evnetObj: NodeEvent) {
        const listens = this._listeners[eventType] || [];
        for (var i = 0, l = listens.length; i < l; i++) {
            const { callback, once } = listens[i];
            if (once) {
                //如果只执行一次则删除
                listens.splice(i, 1);
                if (listens.length === 0) {
                    delete this._listeners[eventType];
                }
                length--;
                i--;
            }
            callback.call(this, evnetObj);
        }
    }

    getListener() {
        return this._listeners;
    }
}
export default EventListenter;
