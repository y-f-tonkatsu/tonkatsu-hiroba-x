import {DisplayObject} from "../../../TonkatsuDisplayLib/Display/DisplayObject";
import {CanvasLayer} from "../../../TonkatsuDisplayLib/Display/CanvasLayer";
import {Size} from "../../../TonkatsuDisplayLib/Display/Size";
import {Point} from "../../../TonkatsuDisplayLib/Display/Point";

function rnd(n: number) {
    return Math.floor(Math.random() * n);
}

type Cell = {
    color: number,
    position: Point,
    subPosition: Point,
    direction: Point,
}

type GameState = "stop" | "play" | "check" | "drop";

export class Mo03Falling extends DisplayObject {

    private _numCells: Size = {width: 12, height: 20};
    private _fieldSize: Size = {width: 0, height: 0};
    private _offsetSize: Point = new Point(0, 0);
    private _cellSize: Size = {width: 0, height: 0};
    private _cells: Cell[][] = [];
    private _currentBlocks = {
        position: new Point(0, 0),
        subPosition: new Point(0, 0),
        direction: Mo03Falling.ROTATION[0].clone(),
        colors: [1, 2],
        rotation: 0
    };

    private _gameState: GameState = "play";

    private static readonly BLOCK_IMAGES = [
        {
            color: "black",
        }, {
            color: "green",
        }, {
            color: "yellow",
        }, {
            color: "blue",
        }, {
            color: "purple",
        }
    ];

    private static readonly ROTATION = [
        new Point(1, 0),
        new Point(0, 1),
        new Point(-1, 0),
        new Point(0, -1),
    ]

    constructor(layer: CanvasLayer) {
        super(layer);

        this.initField(layer);
        this.initCells();

        this.resetCurrentBlocks();

        this.initKeyEvents();
    }

    override update() {
        super.update();
        if (this._gameState === "check") {
            this.checkDrop();
            this.resetCurrentBlocks();
            this._gameState = "play";
        } else if (this._gameState === "play") {
            this.progressDown();
            if (!this.canMoveCurrent(new Point(0, 1))) {
                this.setCurrentToStatic();
                this._gameState = "check";
            }
        }
    }

    override draw() {
        super.draw();
        const ctx = this.layer.context;
        this.drawBG(ctx);
        this.drawStaticBlocks(ctx);
        this.drawCurrentBlocks(ctx);
    }

    private initKeyEvents() {

        document.addEventListener("keydown", e => {
            if (e.key === "s") {
                const d = new Point(0, 1);
                if (this.canMoveCurrent(d)) {
                    this._currentBlocks.position.add(d);
                    this._currentBlocks.subPosition = Point.zero();
                }
            }
        });
        document.addEventListener("keydown", e => {
            if (e.key === "a") {
                const d = new Point(-1, 0);
                if (this.canMoveCurrent(d))
                    this._currentBlocks.position.add(d);
            } else if (e.key === "d") {
                const d = new Point(1, 0);
                if (this.canMoveCurrent(d))
                    this._currentBlocks.position.add(d);
            } else if (e.key === "q") {
                if (this.canRotateCurrent(1)) {
                    this.rotateCurrent(1);
                }
            } else if (e.key === "e") {
                if (this.canRotateCurrent(-1)) {
                    this.rotateCurrent(-1);
                }
            }
        });

    }

    private initCells() {
        this._cells = [];
        for (let y = 0; y < this._numCells.height; y++) {
            this._cells.push([]);
            for (let x = 0; x < this._numCells.width; x++) {
                this._cells[y].push({
                    color: 0,
                    position: new Point(0, 0),
                    subPosition: new Point(0, 0),
                    direction: new Point(0, 0),
                });
            }
        }
    }

    private initField(layer: CanvasLayer) {
        this._offsetSize = new Point(layer.width * 0.5 / 13, layer.height * 2 / 23);

        const width = layer.width * 12 / 13;
        const height = width / 12 * 20;
        this._fieldSize = {width, height};
        this._cellSize = {
            width: this._fieldSize.width / this._numCells.width,
            height: this._fieldSize.height / this._numCells.height,
        }
    }

    resetCurrentBlocks() {
        this._currentBlocks = {
            position: new Point(5, 0),
            subPosition: new Point(0, 0),
            direction: Mo03Falling.ROTATION[0].clone(),
            colors: [rnd(Mo03Falling.BLOCK_IMAGES.length - 1) + 1, rnd(Mo03Falling.BLOCK_IMAGES.length - 1) + 1],
            rotation: 0
        }
    }

    checkDrop() {
        let flg = false;
        for (let y = 0; y < this._numCells.height - 1; y++) {
            for (let x = 0; x < this._numCells.width; x++) {
                const cell = this._cells[y][x];
                const underCell = this._cells[y + 1][x];
                if (underCell.color === 0) {
                    flg = true;
                    cell.direction = new Point(0, 1);
                }

            }
        }
        return flg
    }

    private canMove(p: Point, d: Point): boolean {
        if (p.x + d.x < 0 || p.x + d.x + 1 > this._numCells.width) return false;
        if (p.y + d.y < 0 || p.y + d.y + 1 > this._numCells.height) return false;
        return this._cells[p.y + d.y][p.x + d.x].color === 0;
    }

    private canMoveCurrent(d: Point): boolean {
        return this.canMove(this._currentBlocks.position, d) &&
            this.canMove(Point.combine(this._currentBlocks.position, this._currentBlocks.direction), d);
    }

    private rotateCurrent(d: number) {
        const newR = (this._currentBlocks.rotation + d + Mo03Falling.ROTATION.length) % Mo03Falling.ROTATION.length;
        this._currentBlocks.rotation = newR;
        this._currentBlocks.direction = Mo03Falling.ROTATION[newR].clone();
    }

    private canRotateCurrent(d: number): boolean {
        const newR = (this._currentBlocks.rotation + d + Mo03Falling.ROTATION.length) % Mo03Falling.ROTATION.length;
        return this.canMove(this._currentBlocks.position, Mo03Falling.ROTATION[newR]);
    }

    private setCurrentToStatic() {
        const p1 = this._currentBlocks.position;
        const p2 = Point.combine(p1, this._currentBlocks.direction);
        this._cells[p1.y][p1.x].color = this._currentBlocks.colors[0];
        this._cells[p2.y][p2.x].color = this._currentBlocks.colors[1];
    }

    private progressDown() {
        this._currentBlocks.subPosition.add(new Point(0, 0.2));
        if (this._currentBlocks.subPosition.y >= 1) {
            this._currentBlocks.subPosition = new Point(0, 0);
            this._currentBlocks.position.add(new Point(0, 1));
        }
    }

    private drawCurrentBlocks(ctx: CanvasRenderingContext2D) {

        const subP = Point.multiply(this._currentBlocks.subPosition, this._cellSize.height);

        ctx.fillStyle = Mo03Falling.BLOCK_IMAGES[this._currentBlocks.colors[0]].color;
        const x1 = this._offsetSize.x + this._cellSize.width * this._currentBlocks.position.x + subP.x;
        const y1 = this._offsetSize.y + this._cellSize.height * this._currentBlocks.position.y + subP.y;
        ctx.fillRect(x1, y1, this._cellSize.width, this._cellSize.height);

        ctx.fillStyle = Mo03Falling.BLOCK_IMAGES[this._currentBlocks.colors[1]].color;
        const x2 = this._offsetSize.x + this._cellSize.width * Point.combine(this._currentBlocks.position, this._currentBlocks.direction).x + subP.x;
        const y2 = this._offsetSize.y + this._cellSize.height * Point.combine(this._currentBlocks.position, this._currentBlocks.direction).y + subP.y;
        ctx.fillRect(x2, y2, this._cellSize.width, this._cellSize.height);

    }

    private drawStaticBlocks(ctx: CanvasRenderingContext2D) {
        for (let y = 0; y < this._numCells.height; y++) {
            for (let x = 0; x < this._numCells.width; x++) {
                const cell = this._cells[y][x];
                ctx.fillStyle = Mo03Falling.BLOCK_IMAGES[cell.color].color;
                ctx.fillRect(
                    this._offsetSize.x + this._cellSize.width * x + cell.subPosition.x,
                    this._offsetSize.y + this._cellSize.height * y + cell.subPosition.y,
                    this._cellSize.width, this._cellSize.height);
            }
        }
    }

    private drawBG(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "#aaaaaa";
        ctx.moveTo(0, 0);
        ctx.fillRect(0, 0, this.layer.width, this.layer.height);
        ctx.fillStyle = "#333344";
        ctx.moveTo(this._offsetSize.x, this._offsetSize.y);
        ctx.fillRect(this._offsetSize.x, this._offsetSize.y, this._fieldSize.width, this._fieldSize.height);
    }
}
