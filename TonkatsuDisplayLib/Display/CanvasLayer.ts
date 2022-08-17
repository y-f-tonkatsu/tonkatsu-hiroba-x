import React from "react";

export type CanvasLayerOption = {
    canvas: React.RefObject<HTMLCanvasElement>;
    context: CanvasRenderingContext2D;
    width: number;
    height: number;
    refresh?: boolean;
}

export class CanvasLayer {
    get refresh(): boolean {
        return this._refresh;
    }

    set refresh(value: boolean) {
        this._refresh = value;
    }
    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }

    get context(): CanvasRenderingContext2D {
        return this._context;
    }

    set context(value: CanvasRenderingContext2D) {
        this._context = value;
    }

    get canvas(): React.RefObject<HTMLCanvasElement> {
        return this._canvas;
    }

    set canvas(value: React.RefObject<HTMLCanvasElement>) {
        this._canvas = value;
    }

    private _canvas: React.RefObject<HTMLCanvasElement>;
    private _context: CanvasRenderingContext2D;
    private _width: number;
    private _height: number;
    private _refresh: boolean = false;

    constructor(options: CanvasLayerOption) {
        this._canvas = options.canvas;
        this._context = options.context;
        this._width = options.width;
        this._height = options.height;
        this._refresh = options.refresh || false;
    }

    clear() {
        this._context.clearRect(0, 0, this._width, this._height);
    }
}