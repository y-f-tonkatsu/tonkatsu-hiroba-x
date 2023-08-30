import {MovieClipComponent, MovieClipComponentOptions} from "../Sprite/MovieClipComponent";
import {DisplayObject} from "../../Display/DisplayObject";
import {ImageFile} from "../../ImageLoader/ImageFile";
import {Size} from "../../Display/Size";
import {Point} from "../../Display/Point";
import {CanvasLayer} from "../../Display/CanvasLayer";

export class TileMapWalkerComponent extends MovieClipComponent {
    get cood(): Point {
        return this._cood;
    }

    set cood(value: Point) {
        this._cood = value;
    }

    private _cood: Point = new Point(0, 0);

    constructor(options: MovieClipComponentOptions & { cood: Point }) {
        super(options);
        this._cood = options.cood;
    }

    override update() {
        super.update();
        this.transform.position = Point.multiply(this._cood, 200);
    }

    override draw(layer: CanvasLayer) {
        super.draw(layer);
    }

}