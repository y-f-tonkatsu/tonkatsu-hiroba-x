import {DisplayObject} from "../../../TonkatsuDisplayLib/Display/DisplayObject";
import {CanvasLayer} from "../../../TonkatsuDisplayLib/Display/CanvasLayer";
import {Size} from "../../../TonkatsuDisplayLib/Display/Size";
import {Point} from "../../../TonkatsuDisplayLib/Display/Point";
import {Component} from "../../../TonkatsuDisplayLib/BasicComponents/Component";
import {FieldComponent} from "./FieldComponent";

export type Effect = {
    progress: number,
}

export class EffectComponent extends Component {

    private _layer: CanvasLayer;
    private _effects: Effect[] = [];

    constructor(parent: DisplayObject) {
        super(parent);
        this._layer = parent.layer;
    }

    override update() {
        super.update();
        this._effects.forEach(effect=>{
            effect.progress++;
        })
    }

    override draw() {
        super.draw();
        this.drawEffects();
    }

    private drawEffects() {
        const ctx = this._layer.context;
    }

}