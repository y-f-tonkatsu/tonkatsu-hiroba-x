import {createField, Field} from "./Field";
import {DisplayObject} from "../Display/DisplayObject";
import {createGameLoop} from "../GameLoop/GameLoop";
import {createMover} from "./Mover";

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
}

export const createTonkatsuOpening: (options: TonkatsuOpeningOptions) => TonkatsuOpening =
    (options: TonkatsuOpeningOptions) => {

        const ctx = options.context;

        const field: Field = createField({
            canvasWidth: 1000,
            canvasHeight: 800,
        });

        const gameLoop = createGameLoop({
            frameRate: options.fps,
            ctx: ctx,
            field: field
        });

        const movers: DisplayObject[] = [];
        for (let i = 0; i < 7; i++) {
            movers.push(createMover(field, options.imageList, i + 1));
        }

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