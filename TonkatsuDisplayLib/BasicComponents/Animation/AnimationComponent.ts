import {Component} from "../Component";
import {Animation} from "../../Animations/Animation";
import {DisplayObject} from "../../Display/DisplayObject";
import {Transform} from "../../Display/Transform";

export type AnimationComponentOptions = {
    animation: Animation;
    loop?: boolean;
    onFinishedListener: () => void;
}

/**
 * 表示オブジェクトにアニメーションを設定するコンポーネント
 */
export class AnimationComponent extends Component {
    private _animation: Animation;
    private _loop: boolean = false;
    private _onFinishListener: () => void;

    get loop(): boolean {
        return this._loop;
    }

    set loop(value: boolean) {
        this._loop = value;
    }

    constructor(parent: DisplayObject, options: AnimationComponentOptions) {
        super(parent);
        this._animation = options.animation;
        this.transform = new Transform();
        if (options.loop) this.loop = options.loop;
        this._onFinishListener = options.onFinishedListener;
    }

    update(delta: number) {
        super.update(delta);
        if (!this.transform) return;
        const isFinished = this._animation.animate(this.transform, delta);
        if (isFinished && !this.loop) {
            this.isActive = false;
            this._onFinishListener();
        }
    }
}
