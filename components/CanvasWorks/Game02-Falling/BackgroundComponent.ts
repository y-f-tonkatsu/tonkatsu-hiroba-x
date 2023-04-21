import {DisplayObject} from "../../../TonkatsuDisplayLib/Display/DisplayObject";
import {CanvasLayer} from "../../../TonkatsuDisplayLib/Display/CanvasLayer";
import {Size} from "../../../TonkatsuDisplayLib/Display/Size";
import {Point} from "../../../TonkatsuDisplayLib/Display/Point";
import {Component} from "../../../TonkatsuDisplayLib/BasicComponents/Component";
import {FieldComponent} from "./FieldComponent";

export class BackgroundComponent extends Component {

    get offsetSize(): Point {
        return this._offsetSize;
    }

    private _fieldSize: Size = {width: 0, height: 0};
    private _offsetSize: Point = new Point(0, 0);
    private _layer: CanvasLayer;

    constructor(parent: DisplayObject, fieldComponent: FieldComponent) {
        super(parent);
        this._layer = parent.layer;
        this._offsetSize = new Point(this._layer.width * 0.5 / 13, this._layer.height * 2 / 23);
        this.initFieldSize();
        fieldComponent.offsetSize = this._offsetSize;
        fieldComponent.fieldSize = this._fieldSize;
    }

    /**
     * レイヤーの大きさに対して適切なフィールドサイズを計算し、設定する。
     */
    private initFieldSize() {
        const width = this._layer.width * 12 / 13;
        const height = width / 12 * 20;
        this._fieldSize = {width, height};
    }

    override update() {
        super.update();

    }

    override draw() {
        super.draw();
        const ctx = this._layer.context;
        ctx.clearRect(0, 0, this._layer.width, this._layer.height);
        ctx.fillStyle = "#333344";
        ctx.fillRect(this._offsetSize.x, this._offsetSize.y, this._fieldSize.width, this._fieldSize.height);
    }

}