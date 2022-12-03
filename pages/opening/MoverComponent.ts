import {DisplayObject} from "../../TonkatsuDisplayLib/Display/DisplayObject";
import {Directions, DirectionToVector, Point, VectorToDirection} from "../../TonkatsuDisplayLib/Display/Point";
import {CoordinationComponent} from "../../TonkatsuDisplayLib/BasicComponents/Coordination/CoordinationComponent";
import {Component} from "../../TonkatsuDisplayLib/BasicComponents/Component";
import {CanvasLayer} from "../../TonkatsuDisplayLib/Display/CanvasLayer";

export type MoverAnimationPatterns =
    "jump";

type Modes = "mover" | "gotoHome" | "home";

/**
 * 迷路を移動するテキストを表すコンポーネント
 * CoordinationComponent と協調して動作する
 */
export class MoverComponent extends Component {

    get mode(): Modes {
        return this._mode;
    }

    set mode(value: Modes) {
        this._mode = value;
    }

    private readonly _isPlayer: boolean = false;
    private _mode: Modes = "mover";
    private readonly _coordination: CoordinationComponent;
    private _prevDirection: Point = new Point(0, 0);

    private readonly _destination: Point;

    get coordination(): CoordinationComponent {
        return this._coordination;
    }

    constructor(parent: DisplayObject, coordination: CoordinationComponent,
                destination: Point = new Point(0, 0), isPlayer = false) {
        super(parent);
        this._isPlayer = isPlayer;
        this._coordination = coordination;
        this._coordination.onMoveComplete = this.handleMoveComplete;
        this._destination = destination;
    }

    /**
     * マスからマスへの移動が完了した際のイベントハンドラ。
     * 次に進むべき方向を判断して CoordinationComponent に
     * direction をセットする。
     */
    private handleMoveComplete = () => {

        //現在位置の座標と地形を取得
        const current = this._coordination.coordination;
        let {x, y} = current;
        const tile = this._coordination.field.tiles[y][x];

        if (this.mode === "home") {
            //最終段階なので何もしない
            return;
        } else if (this.mode === "gotoHome") {
            //ホームポジションに向かって方向転換
            this.gotoHome(current);

            //ホームに着いたか判定
            if (current.equals(this._destination)) {
                this.mode = "home";
            }

        } else if (this.mode === "mover") {

            //方向設定
            this.randomMove2(tile, current);

            //崩壊判定
            if (this.coordination.field.isCollapsed(y)) {
                this.mode = "gotoHome";
            }
        }

    }

    /**
     * 次の direction をランダムにセットする。
     * @param tile 現在位置の地形 #0-#f
     * @param current 現在位置の座標
     * @private
     */
    private randomMove(tile: number, current: Point) {
        const directionList = Object.values(Directions);
        while (directionList.length > 0) {

            //ランダムに方向を決定して、リストから消す
            const i = Math.floor(Math.random() * directionList.length);
            const trialDirection = directionList[i];
            directionList.splice(i, 1);

            //仮の移動先を設定
            const directionVector = DirectionToVector(trialDirection);
            const next = Point.combine(current, directionVector);

            //仮の移動先にタイルが存在するか、仮の移動先と現在位置の間に壁があるかを判定
            if (this.coordination.field.existsTile(next) &&
                (tile & trialDirection) === 0) {
                //壁はないので他のオブジェクトとの衝突を判定
                if (!this.coordination.field.isOccupied(current, next)) {
                    this._coordination.direction = directionVector;
                    break;
                }
            }

            //移動先が一つもないケース
            if (directionList.length === 0) {
                //その場にとどまる
                this._coordination.direction = new Point(0, 0);
                break;
            }
        }
    }

    /**
     *
     * @param tile
     * @param current
     * @private
     */
    private randomMove2(tile: number, current: Point) {
        const front = this._prevDirection.isZero() ? new Point(0, 1) : this._prevDirection;
        const back = front.reverse();
        const sideA = new Point(front.y, front.x);
        const sideB = new Point(-front.y, -front.x);
        const canFront = this.canMove(tile, current, front);
        const canBack = this.canMove(tile, current, back);
        const canSideA = this.canMove(tile, current, sideA);
        const canSideB = this.canMove(tile, current, sideB);

        if (!canFront && !canSideA && !canSideB) {
            if(canBack){
                //後ろにしか移動できない
                this.setDirection(Point.zero());
            } else {
                //移動先が一つもないケース
                this.setDirection(Point.zero());
            }
            return;
        }

        const list = [];
        if (canFront) {
            list.push(front);
            list.push(front);
        }
        if (canSideA) {
            list.push(sideA);
        }
        if (canSideB) {
            list.push(sideB);
        }
        this.setDirection(list[Math.floor(Math.random() * list.length)]);

    }

    private setDirection(direction: Point) {
        this._coordination.direction = direction;
        this._prevDirection = direction;
    }

    /**
     * 現在地から指定した方向に移動可能か判定
     * @param tile 現在地のタイル
     * @param current 現在座標
     * @param direction 方向
     * @private
     */
    private canMove(tile: number, current: Point, direction: Point) {
        const next = Point.combine(current, direction);
        return this.coordination.field.existsTile(next) &&
            (tile & VectorToDirection(direction)) === 0 &&
            !this.coordination.field.isOccupied(current, next);
    }

    /**
     * 現在座標から _destination に向けて進むように方向設定する
     * @param current 現在座標
     * @private
     */
    private gotoHome(current: Point) {
        if (current.y > this._destination.y) {
            this._coordination.direction = new Point(0, -1);
        } else if (current.y < this._destination.y) {
            this._coordination.direction = new Point(0, 1);
        } else {
            if (current.x > this._destination.x) {
                this._coordination.direction = new Point(-1, 0);
            } else if (current.x < this._destination.x) {
                this._coordination.direction = new Point(1, 0);
            } else {
                this._coordination.direction = new Point(0, 0);
            }
        }
    }

    override update() {
        super.update();
    }

    override render(layer?: CanvasLayer) {
        super.render(layer);
    }

}
