import {CoordinatedFieldComponent} from "../BasicComponents/Coordination/CoordinatedFieldComponent";
import {DisplayObject} from "../Display/DisplayObject";
import {createGameLoop} from "../GameLoop/GameLoop";
import {MoverComponent} from "./MoverComponent";
import {Size} from "../Display/Size";
import {CoordinationComponent} from "../BasicComponents/Coordination/CoordinationComponent";
import {Point} from "../Display/Point";
import {SpriteComponent} from "../BasicComponents/Sprite/SpriteComponent";
import {JumpAnimation} from "../Animations/Basic/Jump";
import {AnimationComponent} from "../BasicComponents/Animation/AnimationComponent";

export type TonkatsuOpening = {
    start: () => void;
    stop: () => void;
    fps: number;
    context: CanvasRenderingContext2D;
}

export type TonkatsuOpeningOptions = {
    context: CanvasRenderingContext2D;
    fps: number;
    imageList: HTMLImageElement[];
    canvasSize: Size;
}

/**
 * オプションからオープニングオブジェクトを作成して返す
 */
export const createTonkatsuOpening = (options: TonkatsuOpeningOptions) => {

    const ctx = options.context;

    //フィールド作成
    const field = new DisplayObject();
    const tileNum: Size = {
        width: 12,
        height: 9
    }
    const fieldComponent = new CoordinatedFieldComponent(field, tileNum, Math.floor(options.canvasSize.width / tileNum.width));

    //ゲームループ作成
    const gameLoop = createGameLoop({
        frameRate: options.fps,
        ctx, field
    });

    //ディスプレイリストを作成
    const displayList: DisplayObject[] = [];

    //キャラクターを作成してディスプレイリストに追加
    for (let i = 0; i < 7; i++) {
        const tonChar = new DisplayObject();
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
    gameLoop.setUpdateList([field, ...displayList]);

    //オブジェクトを作成して返す
    return {
        start: () => {
            gameLoop.start();
        },
        stop: () => {
            gameLoop.stop();
        },
        fps: options.fps,
        context: ctx,
    }
}