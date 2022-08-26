import {DisplayObject} from "../Display/DisplayObject";
import {CoordinatedFieldComponent} from "../BasicComponents/Coordination/CoordinatedFieldComponent";
import {CanvasLayer} from "../Display/CanvasLayer";

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

    private _isPlaying:boolean = false;

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
            if (0 < updateCount) {

                //必要なら Canvas をクリア
                this._layers.forEach(layer => {
                    if (layer.refresh) layer.clear();
                })

                this.displayList.forEach(obj => {
                    obj.update(updateCount);
                    obj.render();
                })
            }

            //ループする
            this.requestID = requestAnimationFrame(() => {
                this._looper(currentTimeStamp, elapsedTime);
            })
        }
    }

    stop() {
        if(!this._isPlaying) return;
        cancelAnimationFrame(this.requestID);
        this._isPlaying = false;
    }

    start() {
        if(this._isPlaying) return;
        this._looper(performance.now(), 0);
        this._isPlaying = true;
    }


}