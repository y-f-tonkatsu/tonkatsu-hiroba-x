import {DisplayObject, DisplayObjectOptions} from "../../../TonkatsuDisplayLib/Display/DisplayObject";
import {CanvasLayer} from "../../../TonkatsuDisplayLib/Display/CanvasLayer";
import {Point} from "../../../TonkatsuDisplayLib/Display/Point";
import {FieldComponent} from "./FieldComponent";
import {BackgroundComponent} from "./BackgroundComponent";
import {GameUIComponent} from "./GameUIComponent";
import {EffectComponent} from "./EffectComponent";

export function rnd(n: number) {
    return Math.floor(Math.random() * n);
}

export type GameState = "stop" | "play" | "flash" | "check" | "drop";

export class Game02Falling extends DisplayObject {

    private readonly _field: DisplayObject;
    private readonly _fieldComponent: FieldComponent;
    private readonly _background: DisplayObject;
    private readonly _backgroundComponent: BackgroundComponent;
    private readonly _gameUI: DisplayObject;
    private readonly _gameUIComponent: GameUIComponent;
    private readonly _effectManager: DisplayObject;
    private readonly _effectComponent: EffectComponent;

    private _gameState: GameState = "play";
    private _removeKeyBoardEventListeners: () => void = () => {
    };

    private _chain: number = 0;

    constructor(layer: CanvasLayer, options: DisplayObjectOptions) {
        super(layer, options);

        this._gameUI = new DisplayObject(options.layerList[2]);
        this._gameUIComponent = new GameUIComponent(this._gameUI)
        this._effectManager = new DisplayObject(options.layerList[3]);
        this._effectComponent = new EffectComponent(this._effectManager)
        this._field = new DisplayObject(options.layerList[1]);
        this._field.imageFileList = options.imageFileList;
        this._fieldComponent = new FieldComponent(this._field, this._gameUIComponent, this._effectComponent);
        this._background = new DisplayObject(options.layerList[0]);
        this._backgroundComponent = new BackgroundComponent(this, this._fieldComponent);
        this.add(this._field);
        this.add(this._background);
        this.add(this._gameUI);
        this.add(this._effectManager);
        this.initKeyEvents();
    }

    override update() {
        super.update();
        if (this._gameState === "check") {
            if (this._fieldComponent.checkGameOver()) {
                console.log("GameOver!!");
                this._gameState = "stop"
            } else if (this._fieldComponent.checkDrop()) {
                this._gameState = "drop";
                this._fieldComponent.resetCurrentBlocks(false);
            } else if (this._fieldComponent.checkFlash()) {
                this._chain += 1;
                this._gameState = "flash";
                this._fieldComponent.resetCurrentBlocks(false);
            } else {
                this._chain = 1;
                this._gameState = "play";
                this._fieldComponent.resetCurrentBlocks(true);
                this._fieldComponent.resetNextBlocks();
            }
        }

        if (this._gameState === "play") {
            this._fieldComponent.progressDown();
            if (!this._fieldComponent.canMoveCurrent(new Point(0, 1))) {
                this._fieldComponent.setCurrentToStatic();
                this._gameState = "check";
            }
        } else if (this._gameState === "drop") {
            if (this._fieldComponent.progressDrop()) {
                this._gameState = "check";
            }
        } else if (this._gameState === "flash") {
            if (this._fieldComponent.progressFlash(this._chain)) {
                this._gameState = "check";
            }
        }
    }

    override draw() {
        super.draw();
    }

    override destruct() {
        super.destruct();
        this._removeKeyBoardEventListeners();
    }

    private initKeyEvents() {

        const onKeyPress = (e: KeyboardEvent) => {
            if (this._gameState !== "play") return;
            if (e.key === "s") {
                this._fieldComponent.down();
            }
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (this._gameState !== "play") return;
            if (e.key === "a") {
                this._fieldComponent.left();
            } else if (e.key === "d") {
                this._fieldComponent.right();
            } else if (e.key === "q") {
                this._fieldComponent.rotateLeft();
            } else if (e.key === "e") {
                this._fieldComponent.rotateRight();
            }
        }

        document.addEventListener("keypress", onKeyPress);
        document.addEventListener("keydown", onKeyDown);

        this._removeKeyBoardEventListeners = () => {
            document.removeEventListener("keypress", onKeyPress);
            document.removeEventListener("keydown", onKeyDown);
        }
    }

}
