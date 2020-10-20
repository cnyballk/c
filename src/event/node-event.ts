class NodeEvent {
    /**
     * 事件类型
     */
    type: string;
    /**
     * 事件名称
     */
    name: string;
    /**
     * 是否阻止传播（向上冒泡）
     */
    propagationStopped: boolean = false;
    /**
     * 触发时的对象
     */
    pureEvent: Event;
    /**
     * 触发时的时间
     */
    timeStamp: number;
    x: number;
    y: number;
    /**
     * 如果被拖拽，计算出来的 x 距离
     */
    dx: number;
    /**
     * 如果被拖拽，计算出来的 y 距离
     */
    dy: number;
    /**
     * 触发目标
     */
    target: any;
    currentTarget: any;
    //触发路径
    propagationPath: any[] = [];

    constructor(type: string, event: Event) {
        this.type = type;
        this.name = type;
        this.pureEvent = event;
        this.timeStamp = event.timeStamp;
    }
    stopPropagation() {
        this.propagationStopped = true;
    }

    preventDefault() {
        this.pureEvent.preventDefault();
    }
}

export default NodeEvent;
