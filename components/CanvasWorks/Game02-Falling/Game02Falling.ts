import {DisplayObject, DisplayObjectOptions} from "../../../TonkatsuDisplayLib/Display/DisplayObject";
import {CanvasLayer} from "../../../TonkatsuDisplayLib/Display/CanvasLayer";
import {Point} from "../../../TonkatsuDisplayLib/Display/Point";
import {Field} from "./Field";

export function rnd(n: number) {
    return Math.floor(Math.random() * n);
}

export type GameState = "stop" | "play" | "check" | "drop";

export class Game02Falling extends DisplayObject {

    private readonly _field:Field;

    private _gameState: GameState = "play";

    constructor(layer: CanvasLayer, options:DisplayObjectOptions) {
        super(layer, options);

        this._field = new Field(layer, {
            layerList: [],
            imageFileList: this.imageFileList
        });
        this.add(this._field);
        this.initKeyEvents();
    }

    override update() {
        super.update();
        if (this._gameState === "check") {
            this._field.checkDrop();
            this._field.resetCurrentBlocks();
            this._gameState = "play";
        } else if (this._gameState === "play") {
            this._field.progressDown();
            if (!this._field.canMoveCurrent(new Point(0, 1))) {
                this._field.setCurrentToStatic();
                this._gameState = "check";
            }
        }
    }

    override draw() {
        super.draw();
    }

    override destruct() {
        super.destruct();
    }

    private initKeyEvents() {

        document.addEventListener("keypress", e => {
            if (e.key === "s") {
                this._field.down();
            }
        });
        document.addEventListener("keydown", e => {
            if (e.key === "a") {
                this._field.left();
            } else if (e.key === "d") {
                this._field.right();
            } else if (e.key === "q") {
                this._field.rotateLeft();
            } else if (e.key === "e") {
                this._field.rotateRight();
            }
        });

    }

}
