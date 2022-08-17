import {DisplayObject} from "../../TonkatsuDisplayLib/Display/DisplayObject";
import {Directions, DirectionToVector, Point} from "../../TonkatsuDisplayLib/Display/Point";
import {CoordinationComponent} from "../../TonkatsuDisplayLib/BasicComponents/Coordination/CoordinationComponent";
import {Component} from "../../TonkatsuDisplayLib/BasicComponents/Component";
import {CanvasLayer} from "../../TonkatsuDisplayLib/Display/CanvasLayer";

export type MoverAnimationPatterns =
    "jump";

/**
 * 迷路を移動するテキストを表すコンポーネント
 * CoordinationComponent と協調して動作する
 */
export class MoverComponent extends Component {

    private _mode: "animation" | "mover" = "animation";
    private _coordination: CoordinationComponent;

    get coordination(): CoordinationComponent {
        return this._coordination;
    }

    set coordination(value: CoordinationComponent) {
        this._coordination = value;
    }

    get mode(): "animation" | "mover" {
        return this._mode;
    }

    set mode(value: "animation" | "mover") {
        this._mode = value;
    }

    constructor(parent: DisplayObject, coordination: CoordinationComponent) {
        super(parent);
        this._coordination = coordination;
        this._coordination.onMoveComplete = this.handleMoveComplete;
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

        //各方向についてランダムな順序でそれぞれ移動可能かどうかを評価する。
        //可能ならその方向に direction をセットしてループを抜ける
        const directionList = Object.values(Directions);
        while (directionList.length > 0) {

            //ランダムに方向を決定して、リストから消す
            const i = Math.floor(Math.random() * directionList.length);
            const trialDirection = directionList[i];
            directionList.splice(i, 1);

            //壁があるかを判定
            if ((tile & trialDirection) === 0) {
                //壁はないので他のオブジェクトとの衝突を判定
                const directionVector = DirectionToVector(trialDirection);
                const next = Point.combine(current, directionVector);
                if (!this.coordination.field.isOccupied(current, next)) {
                    this._coordination.direction = directionVector;
                    break;
                }
            }
            if (directionList.length === 0) {
                this._coordination.direction = new Point(0, 0);
                break;
            }
        }

    }

    override update(delta: number) {
        super.update(delta);
    }

    override render(layer?: CanvasLayer) {
        super.render(layer);
    }

}
