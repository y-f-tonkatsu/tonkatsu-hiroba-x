import {EffectComponent} from "./EffectComponent";

export class Effect {
    get onEndListener(): () => void {
        return this._onEndListener;
    }

    set onEndListener(value: () => void) {
        this._onEndListener = value;
    }
    get length(): number {
        return this._length;
    }

    set length(value: number) {
        this._length = value;
    }
    get progress(): number {
        return this._progress;
    }

    set progress(value: number) {
        this._progress = value;
    }

    protected _ctx: CanvasRenderingContext2D;
    protected _progress: number = 0;
    private _length: number = 0;
    private _onEndListener: () => void;

    constructor(parent: EffectComponent, onEndListener: () => void) {
        this._ctx = parent.layer.context;
        this._onEndListener = onEndListener;
    }

    update() {
    }

    draw() {

    }

}