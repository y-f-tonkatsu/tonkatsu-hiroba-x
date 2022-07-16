import {Animation} from "../Animation";
import {Point} from "../../Display/Point";
import {Transform} from "../../Display/Transform";


export class JumpAnimation extends Animation {
    override _duration = 10000;

    vy: number = 0;
    vvy: number = 0.5;

    override animate(transform: Transform, delta: number): boolean {
        if (transform.position.y > 60) {
            this.vvy = -5;
        } else if (transform.position.y < -60) {
            this.vvy = 5;
        }
        this.vy += this.vvy;
        this.vy = Math.min(this.vvy, 60);
        this.vy = Math.max(this.vvy, -60);
        transform.position.add(new Point(0, this.vy));

        this._duration += delta;
        if (this._progress > this._duration) {
            this._progress -= this._duration;
            return true;
        } else {
            return false;
        }
    }
}