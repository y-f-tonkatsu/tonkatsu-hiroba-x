import {MovieClipComponent, MovieClipComponentOptions} from "../Sprite/MovieClipComponent";
import {Point} from "../../Display/Point";
import {CanvasLayer} from "../../Display/CanvasLayer";
import {Size} from "../../Display/Size";
import {TileMapComponent} from "./TileMapComponent";

export class TileMapWalkerComponent extends MovieClipComponent {
    get cood(): Point {
        return this._cood;
    }

    set cood(value: Point) {
        this._cood = value;
    }

    private _tileMap: TileMapComponent;
    private _cood: Point = new Point(1, 0);
    private _direction: Point = new Point(0, 0);
    private _progress: number = 1;
    private _tileSize: Size;
    private _onGoal: ()=>void;

    constructor(options: MovieClipComponentOptions & { tileMap: TileMapComponent, cood: Point, tileSize: Size, onGoal:()=>void }) {
        super(options);
        this._cood = options.cood;
        this._tileSize = options.tileSize;
        this._tileMap = options.tileMap;
        this._onGoal = options.onGoal;
    }

    override update() {
        super.update();
        this._progress += 0.05;
        while (this._progress >= 1) {
            this._progress -= 1;
            this.cood.add(this._direction);
            if(this.cood.equals(this._tileMap.goal)){
                this._onGoal();
            }
            this.findDirection();
        }
        this.transform.position = Point.multiply(this._cood, this._tileSize);
        const move = Point.multiply(this._direction, this._progress);
        move.multiply(new Point(this._tileSize.width, this._tileSize.height));
        this.transform.position.add(move);
    }

    override draw(layer: CanvasLayer) {
        super.draw(layer);
    }

    findDirection() {
        const dirs = [
            new Point(0, 1),
            new Point(1, 0),
            new Point(0, -1),
            new Point(-1, 0),
        ]

        const rootMap = this._tileMap.routeMap;
        let dest = new Point(0, 0);
        let priority = Number.POSITIVE_INFINITY;
        dirs.forEach(dir=>{
            const next = Point.combine(this._cood, dir);
            if (
                next.x >= rootMap[0].length ||
                next.x < 0 ||
                next.y >= rootMap.length ||
                next.y < 0
            ) return;

            if(rootMap[next.y][next.x] < priority){
                dest = dir;
                priority = rootMap[next.y][next.x];
            }
        })

        this._direction = dest;
    }

}