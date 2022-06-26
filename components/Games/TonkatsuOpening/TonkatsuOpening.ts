import {createField, Field} from "./Field";
import {DisplayObject} from "../Display/DisplayObject";
import {createGameLoop} from "../GameLoop/GameLoop";
import {createMover} from "./Mover";
import {Size} from "../Display/Size";

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
export const createTonkatsuOpening: (options: TonkatsuOpeningOptions) => TonkatsuOpening =
    (options: TonkatsuOpeningOptions) => {

        const ctx = options.context;

        //フィールド作成
        const field: Field = createField({
            canvasSize: options.canvasSize
        });

        //ゲームループ作成
        const gameLoop = createGameLoop({
            frameRate: options.fps,
            ctx, field
        });

        //ディスプレイリストを作成
        const displayList: DisplayObject[] = [];

        //キャラクターを作成してディスプレイリストに追加
        for (let i = 0; i < 7; i++) {
            displayList.push(createMover({
                field,
                imageList: options.imageList,
                id: i + 1,
                displayList
            }));
        }
        //ディスプレイリストをゲームループに登録
        gameLoop.setUpdateList(displayList);

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