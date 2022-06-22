import {Point} from "./Point";

export type DisplayObject = {
    position: Point;
    direction: Point;
    moving: number,
    coordination: Point,
    update: (delta: number) => void;
    render: (ctx: CanvasRenderingContext2D) => void;
}