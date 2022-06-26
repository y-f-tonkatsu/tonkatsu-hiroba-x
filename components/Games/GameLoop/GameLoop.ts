import {DisplayObject} from "../Display/DisplayObject";
import {Field} from "../TonkatsuOpening/Field";

export type GameLoopOptions = {
    ctx: CanvasRenderingContext2D;
    frameRate: number;
    field: Field;
}

export type GameLoop = {
    start: () => void;
    stop: () => void;
    setField: (field: Field) => void;
    getField: () => Field;
    setUpdateList: (list: DisplayObject[]) => void;
    getUpdateList: () => DisplayObject[];
}

let stopFlag = false;

/**
 * オプションからゲームループオブエジェクトを作成して返す
 * @param options
 */
export const createGameLoop = (options: GameLoopOptions): GameLoop => {

    //requestAnimationFrame 用のIDを保持
    let requestID: number = 0;

    //リフレッシュレート計算 1秒 / フレームレート(fps) = リフレッシュレート(ミリ秒)
    const refreshRate = 1000 / options.frameRate;

    //ディスプレイリスト初期化 実際のセットはメソッドで行う
    let displayList: DisplayObject[] = [];

    //フィールド初期化
    let field: Field = options.field;

    //ループ処理
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

        //フレームをまたいでいたらまたいだ回数だけ update と render を呼び出す
        for (let i = 0; i < updateCount; i++) {
            field.update(updateCount);
            field.render(options.ctx);
            displayList.forEach(obj => {
                obj.update(updateCount);
                obj.render(options.ctx);
            })
        }

        //ループする
        requestID = requestAnimationFrame(() => {
            looper(currentTimeStamp, elapsedTime);
        })
    }

    //オブジェクトを作成して返す
    return {
        stop: () => {
            stopFlag = true;
            cancelAnimationFrame(requestID);
        },
        start: () => {
            looper(performance.now(), 0);
        },
        setField: (val) => {
            field = val;
        },
        getField: () => {
            return field;
        },
        setUpdateList: (list) => {
            displayList = list;
        },
        getUpdateList: () => {
            return displayList;
        },
    };

}