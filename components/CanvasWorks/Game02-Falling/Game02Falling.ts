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

export type GameState = "stop" | "play" | "flash" | "check" | "drop" | "gameOver";

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
    private _gameOverLayer: CanvasLayer;
    private _gameOverImage: HTMLImageElement;
    private _removeEventListeners: () => void = () => {
    };
    private _isDropping: boolean = false;

    private _chain: number = 0;

    constructor(layer: CanvasLayer, options: DisplayObjectOptions) {
        super(layer, options);
        this._gameOverLayer = options.layerList[4];
        this._gameOverImage = options.imageFileList.filter(item => item.id == "gameOver")[0].element;

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
        this.initEventListeners();
    }

    reset() {
        this._fieldComponent.reset();
        this._gameUIComponent.reset();
        this._effectComponent.reset();
        this._gameState = "check";
        this._isDropping = false;
        this._chain = 0;
    }

    override update() {
        super.update();
        if (this._fieldComponent.checkWait()) {
            return;
        }

        if (this._gameState === "check") {
            if (this._fieldComponent.checkGameOver()) {
                this._gameState = "gameOver"
            } else if (this._fieldComponent.checkDrop()) {
                this._gameState = "drop";
                this._fieldComponent.resetCurrentBlocks(false);
            } else if (this._fieldComponent.checkFlash()) {
                this._chain += 1;
                this._gameState = "flash";
                this._fieldComponent.resetCurrentBlocks(false);
            } else {
                this._chain = 0;
                this._gameState = "play";
                this._fieldComponent.resetCurrentBlocks(true);
                this._fieldComponent.resetNextBlocks();
            }
        }

        if (this._gameState === "play") {
            this._fieldComponent.progressDown();
            if (this._isDropping) {
                this._fieldComponent.down();
            }
            if (!this._fieldComponent.canMoveCurrent(new Point(0, 1))) {
                this._fieldComponent.setCurrentToStatic();
                this._isDropping = false;
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
        } else if (this._gameState === "gameOver") {
            this.gameOverScreen();
        }
    }

    override draw() {
        super.draw();
        const ctx = this._gameOverLayer.context;
        if (this._gameState == "gameOver") {
            ctx.drawImage(this._gameOverImage, 0, 0, this._gameOverLayer.width, this._gameOverLayer.height);
            ctx.textAlign = "center";
            ctx.fillStyle = "red";
            ctx.font = "300px corporate-logo-ver2";
            ctx.fillText(this._gameUIComponent.realScore.toString(), this._gameOverLayer.width * 0.5, this._gameOverLayer.height * 0.6);
        } else {
            ctx.clearRect(0, 0, this._gameOverLayer.width, this._gameOverLayer.height);
        }
    }

    override destruct() {
        super.destruct();
        this._removeEventListeners();
    }

    private gameOverScreen() {

    }

    /**
     * イベントリスナー設定
     * アンマウント時のリスナー削除処理の設定も行う
     */
    private initEventListeners() {

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

        let canvas: HTMLCanvasElement;
        if (this._gameOverLayer.canvas == null) {
            return;
        }
        canvas = this._gameOverLayer.canvas

        const onClick = (e: MouseEvent) => {
            if (this._gameState === "gameOver") {
                this.reset();
            } else if (this._gameState === "play") {
                if (e.offsetY > canvas.offsetHeight * 3 / 4) return;
                if (e.offsetX > canvas.offsetWidth * 0.75) {
                    this._fieldComponent.right();
                } else if (e.offsetX > canvas.offsetWidth * 0.5) {
                    this._fieldComponent.rotateRight();
                } else if (e.offsetX > canvas.offsetWidth * 0.25) {
                    this._fieldComponent.rotateLeft();
                } else {
                    this._fieldComponent.left();
                }
            }
        }

        const onMouseDown = (e: MouseEvent) => {
            if (this._gameState === "play") {
                if (e.offsetY > canvas.offsetHeight * 3 / 4) {
                    this._isDropping = true;
                }
            }
        }

        const onMouseUpOrOut = () => {
            if (this._gameState === "play") {
                this._isDropping = false;
            }
        }

        const eventListeners = [
            {target: canvas, type: "click", listener: onClick},
            {target: canvas, type: "pointerdown", listener: onMouseDown},
            {target: canvas, type: "pointerup", listener: onMouseUpOrOut},
            {target: canvas, type: "mouseout", listener: onMouseUpOrOut},
            {target: document, type: "keypress", listener: onKeyPress},
            {target: document, type: "keydown", listener: onKeyDown},
        ];

        eventListeners.forEach(pair => {
            pair.target.addEventListener(pair.type, pair.listener as () => void);
        });

        this._removeEventListeners = () => {
            eventListeners.forEach(pair => {
                pair.target.removeEventListener(pair.type, pair.listener as () => void);
            });
        }
    }

}
