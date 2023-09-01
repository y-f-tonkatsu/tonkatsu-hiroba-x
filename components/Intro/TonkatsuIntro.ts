import {
    CoordinatedFieldComponent
} from "../../TonkatsuDisplayLib/BasicComponents/Coordination/CoordinatedFieldComponent";
import {DisplayObject} from "../../TonkatsuDisplayLib/Display/DisplayObject";
import {GameLoop} from "../../TonkatsuDisplayLib/GameLoop/GameLoop";
import {MoverComponent} from "./MoverComponent";
import {Size} from "../../TonkatsuDisplayLib/Display/Size";
import {CoordinationComponent} from "../../TonkatsuDisplayLib/BasicComponents/Coordination/CoordinationComponent";
import {Point} from "../../TonkatsuDisplayLib/Display/Point";
import {SpriteComponent} from "../../TonkatsuDisplayLib/BasicComponents/Sprite/SpriteComponent";
import {AnimationComponent} from "../../TonkatsuDisplayLib/BasicComponents/Animation/AnimationComponent";
import {TonkatsuIntroCanvasLayers} from "./TonkatsuIntroCanvasLayers";
import {ImageFile} from "../../TonkatsuDisplayLib/ImageLoader/ImageFile";
import {TonkatsuSpinJumpAnimation} from "../../TonkatsuDisplayLib/Animations/Basic/SpinJump";

export type TonkatsuOpeningOptions = {
    layers: TonkatsuIntroCanvasLayers,
    fps: number;
    imageList: ImageFile[];
    canvasSize: Size;
}

/**
 * オプションからオープニングオブジェクトを作成して返す
 */
export class TonkatsuIntro {

    get fps(): Number {
        return this._fps;
    }

    set fps(value: Number) {
        this._fps = value;
    }

    private _fps: Number;
    private _gameLoop: GameLoop;
    private _field: DisplayObject;
    private _fieldComponent: CoordinatedFieldComponent;

    constructor(options: TonkatsuOpeningOptions) {

        this._fps = options.fps;

        //フィールド作成
        const v = TonkatsuIntro.createField(options);
        this._field = v.field;
        this._fieldComponent = v.fieldComponent;

        //ゲームループ作成
        this._gameLoop = new GameLoop({
            layers: [
                options.layers.bgLayer,
                options.layers.mainLayer,
            ],
            frameRate: options.fps,
            field: this._fieldComponent
        });

        //キャラクターを追加したディスプレイリストを作成してゲームループに登録
        const displayList: DisplayObject[] = [this._field];
        this.createCharacters(options, this._fieldComponent, displayList);
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
            const iniX = i < 5 ? i + 1 : i + 2;
            const iniY = 4;
            const initialCoordination = new Point(iniX, iniY);
            const destX = [3, 1, 2, 4, 5, 7, 8, 10, 9];
            const destination = new Point(destX[i], 0);
            const coordinationComponent = TonkatsuIntro.createCoordinationComponent(initialCoordination, tonChar, fieldComponent);
            const spriteComponent = this.createSpriteComponent(i, tonChar, fieldComponent, options.imageList);
            const jumpAnimationComponent = this.createJumpAnimationComponent(tonChar, coordinationComponent, destination);
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
    private static createCoordinationComponent(initialCoordination: Point, tonChar: DisplayObject, fieldComponent: CoordinatedFieldComponent) {
        return new CoordinationComponent(
            tonChar,
            {
                initialCoordination: initialCoordination,
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
            img = imageList.filter(image => image.id === `dogu`)[0];
        } else if (i === 8) {
            img = imageList.filter(image => image.id === `dogu2`)[0];
        } else {
            img = imageList.filter(image => image.id === `logo${i}`)[0];
        }
        return new SpriteComponent(
            {
                parent: tonChar,
                image: img,
                size: {
                    width: fieldComponent.tileSize,
                    height: fieldComponent.tileSize
                },
                centerPosition: new Point(fieldComponent.tileSize * 0.5, fieldComponent.tileSize * 0.5)
            }
        );
    }

    /**
     * アニメーションコンポーネントを作る
     */
    private createJumpAnimationComponent(tonChar: DisplayObject, coordinationComponent: CoordinationComponent, destination: Point) {
        return new AnimationComponent(tonChar, {
            animation: new TonkatsuSpinJumpAnimation(),
            loop: false,
            onFinishedListener: () => {
                //アニメーション再生が完了したら、少し待って MoverComponent をセット
                this._gameLoop.addLoopTimer({
                    callback: () => {
                        const moverComponent = new MoverComponent(tonChar, coordinationComponent, destination, false);
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
        const margin = Math.floor(options.canvasSize.width * 0.02);
        const bgImage = options.imageList.filter(file => file.id === "fieldBG")[0];
        const fieldComponent = new CoordinatedFieldComponent({
            layer: options.layers.bgLayer,
            parent: field,
            tileNum,
            margin,
            tileSize: Math.floor((options.canvasSize.width - margin * 2) / tileNum.width),
            bgImage,
            bgImageSize: options.canvasSize
        });
        return {field, fieldComponent};
    }

    start() {
        this._gameLoop.start();
    }

    stop() {
        this._gameLoop.stop();
    }

    collapse(scrollTop: number) {
        this._fieldComponent.collapse(scrollTop);
    }

}

