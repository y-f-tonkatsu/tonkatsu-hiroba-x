export type CanvasLayerOption = {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    width: number;
    height: number;
    autoRefresh?: boolean;
    name?: string;
}

export class CanvasLayer {
    get name(): string{
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }
    get autoRefresh(): boolean {
        return this._autoRefresh;
    }

    set autoRefresh(value: boolean) {
        this._autoRefresh = value;
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

    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    set canvas(value: HTMLCanvasElement) {
        this._canvas = value;
    }

    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    private _width: number;
    private _height: number;
    private _autoRefresh: boolean = false;
    private _name:string;

    constructor(options: CanvasLayerOption) {
        this._canvas = options.canvas;
        this._context = options.context;
        this._width = options.width;
        this._height = options.height;
        this._autoRefresh = options.autoRefresh || false;
        this._name = options.name || "";
    }

    clear() {
        this._context.clearRect(0, 0, this._width, this._height);
    }
}