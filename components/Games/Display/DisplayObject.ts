import {Point} from "./Point";

export type DisplayObject = {
    position: Point;
    update: (delta:number)=>void;
    render: (ctx:CanvasRenderingContext2D)=>void;
}