import {DisplayObject} from "../../../TonkatsuDisplayLib/Display/DisplayObject";
import {CanvasLayer} from "../../../TonkatsuDisplayLib/Display/CanvasLayer";
import {Component} from "../../../TonkatsuDisplayLib/BasicComponents/Component";
import {Effect} from "./Effect";

export class EffectComponent extends Component {
    get layer(): CanvasLayer {
        return this._layer;
    }

    set layer(value: CanvasLayer) {
        this._layer = value;
    }

    addEffect(effect: Effect) {
        this._effects.push(effect);
    }

    private _layer: CanvasLayer;
    private _effects: Effect[] = [];

    constructor(parent: DisplayObject) {
        super(parent);
        this._layer = parent.layer;
    }

    reset(){
        this._effects = [];
    }

    override update() {
        super.update();
        this._effects.forEach(effect => {
            effect.update();
            effect.progress++;
            if (effect.progress >= effect.length) {
                effect.onEndListener();
                this._effects = this._effects.filter(eff => eff !== effect);
            }
        })
    }

    override draw(layer:CanvasLayer) {
        super.draw(layer);
        this._effects.forEach(effect => {
            effect.draw();
        })
    }

}