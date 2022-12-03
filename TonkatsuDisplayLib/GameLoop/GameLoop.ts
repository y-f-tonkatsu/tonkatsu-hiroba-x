import {DisplayObject} from "../Display/DisplayObject";
import {CoordinatedFieldComponent} from "../BasicComponents/Coordination/CoordinatedFieldComponent";
import {CanvasLayer} from "../Display/CanvasLayer";
import {LoopTimer} from "./LoopTimer";

export type GameLoopOptions = {
    layers: CanvasLayer[];
    frameRate: number;
    field: CoordinatedFieldComponent;
}


/**
 * ゲームループオブジェクト
 * requestAnimationFrame でループし続け
 * DisplayList 内のオブジェクトの
 * update と render を呼び出す。
 */
export class GameLoop {

    get refreshRate(): number {
        return this._refreshRate;
    }

    set refreshRate(value: number) {
        this._refreshRate = value;
    }

    get displayList(): DisplayObject[] {
        return this._displayList;
    }

    set displayList(value: DisplayObject[]) {
        this._displayList = value;
    }

    get requestID(): number {
        return this._requestID;
    }

    set requestID(value: number) {
        this._requestID = value;
    }

    private _requestID: number;
    private _refreshRate: number;
    private _displayList: DisplayObject[] = [];
    private _layers: CanvasLayer[] = [];
    private readonly _looper: (prevTimeStamp: number, elapsedTime: number) => void;

    private _loopTimers: LoopTimer[] = [];
    //タイマーに付与するIDをユニークにするため作成数を保持
    private _loopIDPool = 0;

    private _isPlaying: boolean = false;

    constructor(options: GameLoopOptions) {

        //requestAnimationFrame 用のIDを保持
        this._requestID = 0;

        //リフレッシュレート計算 1秒 / フレームレート(fps) = リフレッシュレート(ミリ秒)
        this._refreshRate = 1000 / options.frameRate;

        this._layers = options.layers;

        //ループ処理
        this._looper = (prevTimeStamp: number, elapsedTime: number) => {

            //デルタタイム取得
            const currentTimeStamp = performance.now();
            const delta: number = currentTimeStamp - prevTimeStamp;
            elapsedTime += delta;
            /** フレームを何回またいだか */
            let updateCount: number = 0;
            while (elapsedTime > this.refreshRate) {
                elapsedTime -= this.refreshRate;
                updateCount++;
            }

            //フレームをまたいでいたら、各 DisplayObject の update と render を呼び出す
            //また、タイマーを処理する
            if (0 < updateCount) {

                //必要なら Canvas をクリア
                this._layers.forEach(layer => {
                    if (layer.autoRefresh) layer.clear();
                });

                //DisplayObject を更新
                this.displayList.forEach(obj => {
                    //複数フレームをまたいでいたら複数 update
                    for (let i = 0; i < updateCount; i++) {
                        obj.update();
                    }
                    //render は1回
                    obj.draw();
                })

                //タイマーを処理
                const remove: LoopTimer[] = [];
                this._loopTimers.forEach(timer => {
                    timer.loopCount -= updateCount;
                    if (timer.loopCount <= 0) {
                        timer.callback();
                        remove.push(timer);
                    }
                });
                remove.forEach(timer => this.removeLoopTimer(timer));

            }

            //ループする
            this.requestID = requestAnimationFrame(() => {
                this._looper(currentTimeStamp, elapsedTime);
            })
        }
    }

    /**
     * ループ開始
     */
    start() {
        if (this._isPlaying) return;
        this._looper(performance.now(), 0);
        this._isPlaying = true;
    }

    /**
     * ループ停止
     */
    stop() {
        if (!this._isPlaying) return;
        cancelAnimationFrame(this.requestID);
        this._isPlaying = false;
    }

    /**
     * 呼び出しごとにユニークなタイマーIDを作成して返す
     */
    private createTimerID(): string {
        this._loopIDPool++;
        return "__loop_id__" + this._loopIDPool;
    }

    /**
     * タイマーの実行を予約する
     * @param timer タイマーオブジェクト
     */
    addLoopTimer(timer: LoopTimer) {
        if (!timer.id) timer.id = this.createTimerID();
        this._loopTimers.push(timer);
    }

    /**
     * タイマーの予約を解除する
     * @param target タイマーオブジェクトまたはそのID
     */
    removeLoopTimer(target: LoopTimer | string) {
        this._loopTimers = this._loopTimers.filter(timer => {
            if (typeof target === "string") {
                return timer.id !== target;
            } else {
                return timer.id !== target.id;
            }
        })
    }

}