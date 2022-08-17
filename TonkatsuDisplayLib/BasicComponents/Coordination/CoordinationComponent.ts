import {Component} from "../Component";
import {DisplayObject, Render, Update} from "../../Display/DisplayObject";
import {Point} from "../../Display/Point";
import {CoordinatedFieldComponent} from "./CoordinatedFieldComponent";
import {CanvasLayer} from "../../Display/CanvasLayer";

export type CoordinationComponentOptions = {
    field: CoordinatedFieldComponent,
    initialCoordination: Point,
}

/**
 * Canvas 座標系とは別の独自の座標系を持つ表示オブジェクト。
 * 座標系自体は CoordinatedFiledComponent で表現され、
 * こちらは座標上で移動する個々のオブエジェクトがそれぞれ所有する。
 * 30px * 30px のような正方形のマスからマスへ移動する。
 * マスからマスへの移動が完了するたびに
 * onMoveComplete() が呼ばれる。
 */
export class CoordinationComponent extends Component {

    private _field: CoordinatedFieldComponent;
    private _coordination: Point = new Point();
    private _direction: Point = new Point();
    private _moveSpeed: number = 0.1;
    private _moveProgress: number = 0;
    private _onMoveComplete = () => {
    };

    set onMoveComplete(value: () => void) {
        this._onMoveComplete = value;
    }

    get onMoveComplete(): () => void {
        return this._onMoveComplete;
    }

    get moveProgress(): number {
        return this._moveProgress;
    }

    set moveProgress(value: number) {
        this._moveProgress = value;
    }

    get moveSpeed(): number {
        return this._moveSpeed;
    }

    set moveSpeed(value: number) {
        this._moveSpeed = value;
    }

    get direction(): Point {
        return this._direction;
    }

    set direction(value: Point) {
        this._direction = value;
    }

    get field(): CoordinatedFieldComponent {
        return this._field;
    }

    set field(value: CoordinatedFieldComponent) {
        this._field = value;
    }

    get coordination(): Point {
        return this._coordination;
    }

    set coordination(value: Point) {
        this._coordination = value;
    }

    constructor(parent: DisplayObject, options: CoordinationComponentOptions) {
        super(parent);
        this._field = options.field;
        this._field.addOccupants(this);
        this._coordination = options.initialCoordination;
    }

    override update: Update = delta => {

        if (!this.parent) return;

        super.update(delta);

        this._moveProgress += this._moveSpeed * delta;

        while (this._moveProgress > 1) {
            this._moveProgress -= 1;
            this._coordination.add(this._direction);
            this._onMoveComplete();
        }

        const pos = this._coordination.clone();
        pos.multiply(new Point(this._field.tileSize, this._field.tileSize));
        const moveX = this._direction.x * this._field.tileSize * this._moveProgress;
        const moveY = this._direction.y * this._field.tileSize * this._moveProgress;
        pos.add(new Point(moveX, moveY));
        this.parent.transform.position = pos;

    };
    override render(layer?:CanvasLayer) {
        super.render(layer);
    };

}