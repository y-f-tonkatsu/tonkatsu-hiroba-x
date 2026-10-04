import {Animation} from "../Animation";
import {Point} from "../../Display/Point";
import {Transform} from "../../Display/Transform";


export class JumpAnimation extends Animation {
    override _duration = 0;

    _vy: number = -20;
    _gravity = 1;

    override animate(transform: Transform): boolean {

        this._vy += this._gravity;
        transform.position.add(new Point(0, this._vy));
        if (transform.position.y >= 0) {
            transform.reset();
            return true
        } else {
            return false;
        }
    }
}