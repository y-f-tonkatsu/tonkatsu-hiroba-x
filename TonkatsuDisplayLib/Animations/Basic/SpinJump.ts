import {Animation} from "../Animation";
import {Point} from "../../Display/Point";
import {Transform} from "../../Display/Transform";

/**
 * 回転しながら飛び出すアニメーション
 * とんかつひろばオープニングのイントロで使用
 */
export class TonkatsuSpinJumpAnimation extends Animation {
    override _duration = 0;

    _height: number = 0;
    _scaleCorrection = 0;
    _velocity: number = 3.5;
    _gravity = 0.15;

    override animate(transform: Transform): boolean {

        this._velocity -= this._gravity;
        this._height += this._velocity * 0.05;
        this._scaleCorrection = Math.min(this._scaleCorrection + 0.1, 1);
        transform.position = new Point(0, -this._height*3);
        transform.scale = new Point(this._scaleCorrection + this._height * 0.03, this._scaleCorrection + this._height * 0.03);
        transform.rotation += 0.15;
        if (this._height <= 0) {
            transform.zero();
            return true
        } else {
            return false;
        }
    }
}