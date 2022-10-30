import {Point} from "../../Display/Point";
import {Size} from "../../Display/Size";
import {DisplayObject} from "../../Display/DisplayObject";
import {Component} from "../Component";
import {CanvasLayer} from "../../Display/CanvasLayer";
import {ImageFile} from "../../ImageLoader/ImageFile";

export type Coordinated = {
    coordination: Point;
    direction: Point;
}

export type CoordinatedFieldComponentOption = {
    layer: CanvasLayer,
    parent: DisplayObject,
    tileNum: Size,
    margin: number,
    tileSize: number,
    bgImage: ImageFile
}

export class CoordinatedFieldComponent extends Component {
    get margin(): number {
        return this._margin;
    }

    set margin(value: number) {
        this._margin = value;
    }
    get tiles(): number[][] {
        return this._tiles;
    }

    set tiles(value: number[][]) {
        this._tiles = value;
    }

    get tileSize(): number {
        return this._tileSize;
    }

    set tileSize(value: number) {
        this._tileSize = value;
    }

    private readonly _tileNum: Size;
    private _tileSize: number;
    private _margin: number;
    private _tiles: number[][] = [[]];
    private _occupants: Coordinated[] = [];
    private readonly _layer: CanvasLayer;
    private _isInitiated: boolean = false;
    private _bgImage: ImageFile;

    constructor(options: CoordinatedFieldComponentOption) {
        super(options.parent);
        this._layer = options.layer;
        this._tileNum = options.tileNum;
        this._tileSize = options.tileSize;
        this._margin = options.margin;
        this._bgImage = options.bgImage;
        this._tiles =
            [
                [9, 8, 10, 8, 10, 10, 8, 10, 10, 8, 10, 12],
                [5, 3, 12, 1, 12, 9, 2, 12, 9, 2, 12, 5],
                [5, 9, 2, 6, 5, 3, 12, 5, 5, 9, 6, 5],
                [5, 3, 12, 9, 2, 10, 6, 3, 4, 3, 10, 4],
                [1, 10, 4, 5, 9, 10, 8, 8, 2, 10, 12, 5],
                [1, 12, 1, 2, 2, 12, 5, 3, 10, 12, 1, 4],
                [5, 1, 6, 9, 10, 4, 5, 9, 10, 6, 5, 5],
                [5, 3, 8, 6, 9, 6, 1, 2, 10, 10, 4, 5],
                [3, 10, 2, 10, 2, 10, 2, 10, 10, 10, 2, 6],
            ]
    }

    override update = () => {
        super.update();
    }

    override render = () => {
        super.render();

        this._isInitiated = true;

        const ctx = this._layer.context;

        const {_tileNum, _tileSize, _tiles, _margin} = this;
        const fullWidth = _tileNum.width * _tileSize + _margin * 2;
        const fullHeight = _tileNum.height * _tileSize + _margin * 2;
        ctx.clearRect(
            0,
            0,
            fullWidth,
            fullHeight
        );
        ctx.drawImage(this._bgImage.element,
            0,
            0,
            fullWidth,
            fullHeight
        );
    }

    public addOccupants(occupant: Coordinated) {
        this._occupants.push(occupant);
    }

    public isOccupied(current: Point, next: Point) {
        let value = false;
        this._occupants.forEach(target => {
            const targetCurrent = target.coordination;
            const targetNext = Point.combine(target.coordination, target.direction);
            //同じ位置への移動禁止
            if (targetNext.equals(next)) {
                value = true;
            }
            //位置入れ替え禁止
            if (targetNext.equals(current) && targetCurrent.equals(next)) {
                value = true;
            }
            if (target.direction.isZero() && next.equals(targetCurrent)) {
                value = true;
            }
        });
        return value;
    }

}
