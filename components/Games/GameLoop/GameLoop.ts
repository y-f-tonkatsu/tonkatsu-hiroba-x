import {DisplayObject} from "../Display/DisplayObject";

export type GameLoopOptions = {
    ctx:CanvasRenderingContext2D;
    frameRate: number;
}

export type GameLooper = {
    start: ()=>void,
    stop: ()=>void,
    setUpdateList: (list:DisplayObject[])=>void,
    getUpdateList: ()=>DisplayObject[],
}

export const createGameLoop = (options:GameLoopOptions):GameLooper => {

    let requestID:number = 0;

    //初期化
    const refreshRate = 1000 / options.frameRate;
    let displayList:DisplayObject[] = [];

    const looper = (prevTimeStamp: number, elapsedTime: number) => {

        //デルタタイム取得
        const currentTimeStamp = performance.now();
        const delta: number = currentTimeStamp - prevTimeStamp;
        elapsedTime += delta;

        /** フレームを何回またいだか */
        let updateCount: number = 0;
        while (elapsedTime > refreshRate) {
            elapsedTime -= refreshRate;
            updateCount++;
        }

        //フレームをまたいでいたら update を呼び出す
        if (updateCount > 0) {
            displayList.forEach(obj=>{
                obj.update(updateCount);
                obj.render(options.ctx);
            })
        }

        requestID = requestAnimationFrame(() => {
            looper(currentTimeStamp, elapsedTime);
        })
    }

    return {
        stop: ()=>{
            cancelAnimationFrame(requestID);
        },
        start: ()=>{
            looper(performance.now(), 0);
        },
        setUpdateList:(list)=>{
            displayList = list;
        },
        getUpdateList:()=>{
            return displayList;
        },
    };

}