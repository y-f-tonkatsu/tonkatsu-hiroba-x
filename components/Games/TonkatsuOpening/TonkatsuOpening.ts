import {createField, Field} from "./Field";
import {DisplayObject} from "../Display/DisplayObject";
import {createGameLoop} from "../GameLoop/GameLoop";
import {createMover} from "./Mover";
import {Size} from "../Display/Size";
import {useWindowSize} from "../Display/WindowSize";

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

export const createTonkatsuOpening: (options: TonkatsuOpeningOptions) => TonkatsuOpening =
    (options: TonkatsuOpeningOptions) => {

        const ctx = options.context;

        const field: Field = createField({
            canvasSize: options.canvasSize
        });

        const gameLoop = createGameLoop({
            frameRate: options.fps,
            ctx, field
        });

        const displayList: DisplayObject[] = [];

        const movers: DisplayObject[] = [];
        for (let i = 0; i < 7; i++) {
            movers.push(createMover({
                field,
                imageList: options.imageList,
                id: i + 1,
                displayList
            }));
        }
        displayList.push(...movers);

        gameLoop.setUpdateList(movers);

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