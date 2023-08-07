import {DisplayObject, DisplayObjectOptions} from "../../../TonkatsuDisplayLib/Display/DisplayObject";
import {CanvasLayer} from "../../../TonkatsuDisplayLib/Display/CanvasLayer";

export class Game03TowerDefense extends DisplayObject {

    constructor(layer: CanvasLayer, options: DisplayObjectOptions) {
        super(layer, options);
     }

    override update() {
        super.update();
    }

    override draw() {
        super.draw();
        const ctx = this.layer.context;
        ctx.fillStyle = "blue";
        ctx.fillRect(0, 0, 100, 100);
    }

}
