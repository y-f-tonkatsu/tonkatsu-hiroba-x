import {CoordinatedFieldComponent} from "../../TonkatsuDisplayLib/BasicComponents/Coordination/CoordinatedFieldComponent";
import {DisplayObject} from "../../TonkatsuDisplayLib/Display/DisplayObject";
import {GameLoop} from "../../TonkatsuDisplayLib/GameLoop/GameLoop";
import {MoverComponent} from "./MoverComponent";
import {Size} from "../../TonkatsuDisplayLib/Display/Size";
import {CoordinationComponent} from "../../TonkatsuDisplayLib/BasicComponents/Coordination/CoordinationComponent";
import {Point} from "../../TonkatsuDisplayLib/Display/Point";
import {SpriteComponent} from "../../TonkatsuDisplayLib/BasicComponents/Sprite/SpriteComponent";
import {JumpAnimation} from "../../TonkatsuDisplayLib/Animations/Basic/Jump";
import {AnimationComponent} from "../../TonkatsuDisplayLib/BasicComponents/Animation/AnimationComponent";
import {TonkatsuOpeningCanvasLayers} from "./TonkatsuOpeningCanvasLayers";

export type TonkatsuOpeningOptions = {
    layers: TonkatsuOpeningCanvasLayers,
    fps: number;
    imageList: HTMLImageElement[];
    canvasSize: Size;
}

/**
 * オプションからオープニングオブジェクトを作成して返す
 */
export class TonkatsuOpening {
    get fps(): Number {
        return this._fps;
    }

    set fps(value: Number) {
        this._fps = value;
    }

    private _fps: Number;
    private _gameLoop: GameLoop;

    constructor(options: TonkatsuOpeningOptions) {

        //フィールド作成
        const field = new DisplayObject(options.layers.mainLayer);
        const tileNum: Size = {
            width: 12,
            height: 9
        }
        const fieldComponent = new CoordinatedFieldComponent({
            layer: options.layers.bgLayer,
            parent: field,
            tileNum: tileNum,
            tileSize: Math.floor(options.canvasSize.width / tileNum.width)
        });

        //ゲームループ作成
        this._gameLoop = new GameLoop({
            layers: [
                options.layers.bgLayer,
                options.layers.mainLayer,
            ],
            frameRate: options.fps,
            field: fieldComponent
        });

        //ディスプレイリストを作成
        const displayList: DisplayObject[] = [];

        //キャラクターを作成してディスプレイリストに追加
        for (let i = 0; i < 7; i++) {
            const tonChar = new DisplayObject(options.layers.mainLayer);
            const coordinationComponent =
                new CoordinationComponent(
                    tonChar,
                    {
                        initialCoordination: new Point(i + 1, 4),
                        field: fieldComponent,
                    }
                );
            const spriteComponent =
                new SpriteComponent(
                    tonChar,
                    options.imageList[i],
                    {
                        width: fieldComponent.tileSize,
                        height: fieldComponent.tileSize
                    });
            const moverComponent = new MoverComponent(tonChar, coordinationComponent);
            const jumpAnimationComponent = new AnimationComponent(tonChar, {
                animation: new JumpAnimation(),
                loop: true,
                onFinishedListener: () => {
                }
            })
            tonChar.attachComponent(moverComponent, coordinationComponent, spriteComponent, jumpAnimationComponent);

            displayList.push(tonChar);
        }

        //ディスプレイリストをゲームループに登録
        this._gameLoop.displayList = ([field, ...displayList]);

        this._fps = options.fps;

    }

    start() {
        this._gameLoop.start();
    }

    stop() {
        this._gameLoop.stop();
    }

}

