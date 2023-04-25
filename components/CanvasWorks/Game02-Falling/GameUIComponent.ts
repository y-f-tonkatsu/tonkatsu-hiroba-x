import {DisplayObject} from "../../../TonkatsuDisplayLib/Display/DisplayObject";
import {CanvasLayer} from "../../../TonkatsuDisplayLib/Display/CanvasLayer";
import {Size} from "../../../TonkatsuDisplayLib/Display/Size";
import {Point} from "../../../TonkatsuDisplayLib/Display/Point";
import {Component} from "../../../TonkatsuDisplayLib/BasicComponents/Component";
import {FieldComponent} from "./FieldComponent";

export class GameUIComponent extends Component {
    get realScore(): number {
        return this._realScore;
    }

    set realScore(value: number) {
        this._realScore = value;
    }

    addScore(value: number) {
        this._realScore += value;
    }

    setNextBlockImages(b1:HTMLImageElement, b2:HTMLImageElement){
        this._nextBlockImages[0] = b1;
        this._nextBlockImages[1] = b2;
    }

    private _layer: CanvasLayer;
    private _realScore: number = 0;
    private _displayScore: number = 0;
    private _nextBlockImages: HTMLImageElement[] = [];

    constructor(parent: DisplayObject,) {
        super(parent);
        this._layer = parent.layer;
    }

    override update() {
        super.update();
        if (this._realScore > this._displayScore) {
            this._displayScore++;
        }

    }

    override draw() {
        super.draw();
        this.drawNext();
        this.drawScore();
    }

    private drawNext() {
        if(this._nextBlockImages.length < 2) return;
        const ctx = this._layer.context;
        ctx.drawImage(this._nextBlockImages[0], 320, 40, 140, 140);
        ctx.drawImage(this._nextBlockImages[1], 460, 40, 140, 140);
    }

    private drawScore() {
        const ctx = this._layer.context;
        ctx.font = "120px corporate-logo-ver2";
        ctx.textAlign = "right";
        ctx.fillStyle = "red";
        ctx.fillText(this._displayScore.toString(), 1200, 200);
    }
}