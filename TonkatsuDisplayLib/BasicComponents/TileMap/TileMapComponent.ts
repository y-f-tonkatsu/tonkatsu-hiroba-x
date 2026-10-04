import {Component} from "../Component";
import {DisplayObject} from "../../Display/DisplayObject";
import {CanvasLayer} from "../../Display/CanvasLayer";
import {ImageFile} from "../../ImageLoader/ImageFile";
import {Size} from "../../Display/Size";
import {Point} from "../../Display/Point";

export type MapData = number[][];
export type TileMapComponentOptions = {
    imageList: ImageFile[],
    tileSize: Size,
    mapData: MapData,
    tiles: Tile[],
    start: Point,
    goal: Point,
}
export type Tile = {
    image: HTMLImageElement,
    isPassable: boolean,
}

export class TileMapComponent extends Component {
    get goal(): Point {
        return this._goal;
    }

    set goal(value: Point) {
        this._goal = value;
        this.route();
    }
    get start(): Point {
        return this._start;
    }

    set start(value: Point) {
        this._start = value;
        this.route();
    }
    get routeMap(): MapData {
        return this._routeMap;
    }

    set routeMap(value: MapData) {
        this._routeMap = value;
    }
    get mapData(): MapData {
        return this._mapData;
    }

    set mapData(value: MapData) {
        this.canSkipRender = false;
        this._mapData = value;
    }

    private _imageList: ImageFile[];
    private _mapData: MapData = [];
    private _routeMap: MapData = [];
    private _tileSize: Size;
    private _tiles: Tile[] = [];
    private _start: Point = new Point(0, 0);
    private _goal: Point = new Point(0, 0);

    constructor(parent: DisplayObject, options: TileMapComponentOptions) {
        super(parent);
        this._imageList = options.imageList;
        this._tileSize = options.tileSize;
        this.mapData = options.mapData;
        this._tiles = options.tiles;
        this.start = options.start;
        this.goal = options.goal;
    }

    update() {
        super.update();
    }

    draw(layer: CanvasLayer) {
        super.draw(layer);

        this.mapData.forEach((row, y) => {
            row.forEach((id, x) => {
                this.drawTile(layer.context, this._tiles[id].image, x, y);
            })
        })

        //一度描画したらマップが更新されるまで再レンダーしない
        this.canSkipRender = true;
    }

    drawTile(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number) {
        const {position, scale, rotation} = this.parent.renderTransform;
        const w = this._tileSize.width * scale.x;
        const h = this._tileSize.height * scale.y;
        const cx = position.x;
        const cy = position.y;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation);
        ctx.drawImage(img, x * w, y * h, w, h);
        ctx.restore();
    }

    route() {

        this._mapData.forEach((row, y) => {
            this._routeMap[y] = [];
            row.forEach((col, x) => {
                this._routeMap[y][x] = Number.POSITIVE_INFINITY;
            });
        })
        this._routeMap[this._goal.y][this._goal.x] = 0;

        const dirs = [
            new Point(0, 1),
            new Point(1, 0),
            new Point(0, -1),
            new Point(-1, 0),
        ]

        const f = (cood: Point, dist: number) => {
            dirs.forEach(dir => {
                const next = Point.combine(cood, dir);
                if (
                    next.x >= this._routeMap[0].length ||
                    next.x < 0 ||
                    next.y >= this._routeMap.length ||
                    next.y < 0
                ) return;

                if(!this._tiles[this._mapData[next.y][next.x]].isPassable) return;

                if (this._routeMap[next.y][next.x] > dist + 1) {
                    this._routeMap[next.y][next.x] = dist + 1;
                    f(next, dist + 1);
                }
            })
        };

        f(this._goal, 0);

    }

}