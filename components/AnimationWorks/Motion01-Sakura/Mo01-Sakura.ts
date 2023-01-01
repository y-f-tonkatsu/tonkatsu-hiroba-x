import {DisplayObject} from "../../../TonkatsuDisplayLib/Display/DisplayObject";
import {CanvasLayer} from "../../../TonkatsuDisplayLib/Display/CanvasLayer";

export class Mo01Sakura extends DisplayObject {
    private _t:number = 0;

    constructor(layer: CanvasLayer) {
        super(layer);
    }

    override update() {
        this._t++;
        console.log("update!");
        super.update();
    }

    override draw() {
        super.draw();
        const ctx = this.layer.context;
        console.log(this.layer);
        const [w, h] = [this.layer.width, this.layer.height];
        console.log(w, h);
        ctx.strokeStyle = "#fff";
        ctx.clearRect(0,0, w, h);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this._t, h);
        ctx.closePath();
        ctx.stroke();
    }
}