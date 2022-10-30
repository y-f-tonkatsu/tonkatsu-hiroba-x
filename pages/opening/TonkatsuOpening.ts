import {CoordinatedFieldComponent} from "../../TonkatsuDisplayLib/BasicComponents/Coordination/CoordinatedFieldComponent";
import {DisplayObject} from "../../TonkatsuDisplayLib/Display/DisplayObject";
import {GameLoop} from "../../TonkatsuDisplayLib/GameLoop/GameLoop";
import {MoverComponent} from "./MoverComponent";
import {Size} from "../../TonkatsuDisplayLib/Display/Size";
import {CoordinationComponent} from "../../TonkatsuDisplayLib/BasicComponents/Coordination/CoordinationComponent";
import {Point} from "../../TonkatsuDisplayLib/Display/Point";
import {SpriteComponent} from "../../TonkatsuDisplayLib/BasicComponents/Sprite/SpriteComponent";
import {AnimationComponent} from "../../TonkatsuDisplayLib/BasicComponents/Animation/AnimationComponent";
import {TonkatsuOpeningCanvasLayers} from "./TonkatsuOpeningCanvasLayers";
import {ImageFile} from "../../TonkatsuDisplayLib/ImageLoader/ImageFile";
import {TonkatsuSpinJumpAnimation} from "../../TonkatsuDisplayLib/Animations/Basic/SpinJump";

export type TonkatsuOpeningOptions = {
    layers: TonkatsuOpeningCanvasLayers,
    fps: number;
    imageList: ImageFile[];
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

        this._fps = options.fps;

        //フィールド作成
        const {field, fieldComponent} = TonkatsuOpening.createField(options);

        //ゲームループ作成
        this._gameLoop = new GameLoop({
            layers: [
                options.layers.bgLayer,
                options.layers.mainLayer,
            ],
            frameRate: options.fps,
            field: fieldComponent
        });

        //キャラクターを追加したディスプレイリストを作成してゲームループに登録
        const displayList: DisplayObject[] = [field];
        this.createCharacters(options, fieldComponent, displayList);
        this._gameLoop.displayList = displayList;

    }

    /**
     * キャラクターを作成してディスプレイリストに詰めて返す
     * @private
     */
    private createCharacters(options: TonkatsuOpeningOptions, fieldComponent: CoordinatedFieldComponent, displayList: DisplayObject[]) {

        //個々のキャラクター作成関数
        const create = (i: number) => {

            //ディスプレイオブジェクトを作る
            const tonChar = new DisplayObject(options.layers.mainLayer);

            //コンポーネントをセット
            const coordinationComponent = TonkatsuOpening.createCoordinationComponent(i, tonChar, fieldComponent);
            const spriteComponent = this.createSpriteComponent(i, tonChar, fieldComponent, options.imageList);
            const jumpAnimationComponent = this.createJumpAnimationComponent(tonChar, coordinationComponent);
            tonChar.attachComponent(coordinationComponent, spriteComponent, jumpAnimationComponent);

            //ディスプレイリストに追加
            displayList.push(tonChar);
        }

        //複数のキャラクターを時間差で追加する
        for (let i = 0; i < 9; i++) {
            this._gameLoop.addLoopTimer({
                callback: () => {
                    create(i);
                },
                loopCount: i * 10
            });
        }

        return displayList;
    }

    /**
     * 座標コンポーネントを作る
     */
    private static createCoordinationComponent(i: number, tonChar: DisplayObject, fieldComponent: CoordinatedFieldComponent) {
        const xp = i < 5 ? i + 1 : i + 2;
        return new CoordinationComponent(
            tonChar,
            {
                initialCoordination: new Point(xp, 4),
                field: fieldComponent,
            }
        );
    }

    /**
     * スプライトコンポーネントを作る
     */
    private createSpriteComponent(i: number, tonChar: DisplayObject, fieldComponent: CoordinatedFieldComponent, imageList: ImageFile[]) {
        let img;
        if (i === 0) {
            img = imageList.filter(image => image.id === `philosopher_normal`)[0];
        } else if (i === 8) {
            img = imageList.filter(image => image.id === `philosopher_shock`)[0];
        } else {
            img = imageList.filter(image => image.id === `logo${i}`)[0];
        }
        return new SpriteComponent(
            tonChar,
            img,
            {
                width: fieldComponent.tileSize,
                height: fieldComponent.tileSize
            });
    }

    /**
     * アニメーションコンポーネントを作る
     */
    private createJumpAnimationComponent(tonChar: DisplayObject, coordinationComponent: CoordinationComponent) {
        return new AnimationComponent(tonChar, {
            animation: new TonkatsuSpinJumpAnimation(),
            loop: false,
            onFinishedListener: () => {
                //アニメーション再生が完了したら、少し待って MoverComponent をセット
                this._gameLoop.addLoopTimer({
                    callback: () => {
                        const moverComponent = new MoverComponent(tonChar, coordinationComponent);
                        tonChar.attachComponent(moverComponent);
                    },
                    loopCount: 100
                });
            }
        });
    }

    /**
     * フィールド作成
     */
    private static createField(options: TonkatsuOpeningOptions) {
        const field = new DisplayObject(options.layers.mainLayer);
        const tileNum: Size = {
            width: 12,
            height: 9
        }
        const margin = 15;
        const bgImage = options.imageList.filter(file => file.id === "fieldBG")[0];
        const fieldComponent = new CoordinatedFieldComponent({
            layer: options.layers.bgLayer,
            parent: field,
            tileNum,
            margin,
            tileSize: Math.floor((options.canvasSize.width - margin * 2) / tileNum.width),
            bgImage
        });
        return {field, fieldComponent};
    }

    start() {
        this._gameLoop.start();
    }

    stop() {
        this._gameLoop.stop();
    }

}
