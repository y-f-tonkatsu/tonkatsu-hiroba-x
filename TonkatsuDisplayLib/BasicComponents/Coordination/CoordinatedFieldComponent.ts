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

    get fullWidth(): number {
        return this._tileNum.width * this._tileSize + this._margin * 2;
    }

    get fullHeight(): number {
        return this._tileNum.height * this._tileSize + this._margin * 2;
    }

    private readonly _tileNum: Size;
    private _tileSize: number;
    private _margin: number;
    private _tiles: number[][] = [[]];
    private _occupants: Coordinated[] = [];
    private readonly _layer: CanvasLayer;
    private _isInitiated: boolean = false;
    private _bgImage: ImageFile;

    //下から何行目まで崩壊したか
    private _collapseLevel: number = 0;
    //各業の崩壊の進行度 最大値は fullWidth
    private readonly _levelCollapses: number[];

    constructor(options: CoordinatedFieldComponentOption) {
        super(options.parent);
        this._layer = options.layer;
        this._tileNum = options.tileNum;
        this._levelCollapses = Array.from(Array(this._tileNum.height)).map(() => 0);
        this._tileSize = options.tileSize;
        this._margin = options.margin;
        this._bgImage = options.bgImage;
        //固定の迷路をセット
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
        this.updateCollapse();
    }

    /**
     * 崩壊の進行処理
     * @private
     */
    private updateCollapse() {
        if (this._collapseLevel === 0) return;
        const MAX_PROGRESS = this.fullWidth;
        //現在の崩壊深度以下の改装について崩壊を進行させる
        for (let i = this._levelCollapses.length - 1; i >= this._tileNum.height - this._collapseLevel; i--) {
            if (this._levelCollapses[i] < MAX_PROGRESS) this._levelCollapses[i] += 5 + this._levelCollapses[i] * 0.6;
        }
    }

    override render = () => {
        super.render();

        this._isInitiated = true;

        const ctx = this._layer.context;

        const {fullWidth, fullHeight} = this;
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
        this.renderCollapse(ctx);
    }

    /**
     * 崩壊の描写
     * @param ctx Canvas コンテキスト
     * @private
     */
    private renderCollapse(ctx: CanvasRenderingContext2D) {
        ctx.globalCompositeOperation = 'destination-out';
        for (let i = 0; i < this._levelCollapses.length; i++) {
            if (i % 2 == 1) {
                ctx.fillRect(0, i * this._tileSize + this._margin, this._levelCollapses[i], (i + 1) * this._tileSize);
            } else {
                ctx.fillRect(this.fullWidth - this._levelCollapses[i], i * this._tileSize + this._margin, this._levelCollapses[i], (i + 1) * this._tileSize);
            }
        }
        ctx.globalCompositeOperation = 'source-over';
    }

    /**
     * 指定深度まで崩壊させる。
     * 指定深度が現在の崩壊深度より浅い場合は何も起こらない。
     * @param collapseHeight 指定深度
     */
    public collapse(collapseHeight: number) {
        if (collapseHeight === 0) return;
        const level = Math.floor(collapseHeight / this.fullHeight * this._tileNum.height) + 1;
        this._collapseLevel = Math.max(this._collapseLevel, level);
        this._collapseLevel = Math.min(this._collapseLevel, this._tileNum.height - 1);
    }

    /**
     * 対象のy座標が崩壊しているなら true を返す。
     * @param y 対象の座標
     */
    public isCollapsed(y: number) {
        return y >= this._tileNum.height - this._collapseLevel;
    }

    public addOccupants(occupant: Coordinated) {
        this._occupants.push(occupant);
    }

    public existsTile(tile: Point) {
        return tile.x > 0 &&
            tile.x < this._tiles[0].length &&
            tile.y > 0 &&
            tile.y < this._tiles.length;
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
