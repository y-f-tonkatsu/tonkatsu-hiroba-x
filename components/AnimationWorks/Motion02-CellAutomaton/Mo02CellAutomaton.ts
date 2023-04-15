import {DisplayObject} from "../../../TonkatsuDisplayLib/Display/DisplayObject";
import {CanvasLayer} from "../../../TonkatsuDisplayLib/Display/CanvasLayer";
import {Size} from "../../../TonkatsuDisplayLib/Display/Size";
import {Point} from "../../../TonkatsuDisplayLib/Display/Point";

export class Mo02CellAutomaton extends DisplayObject {

    private _size: Size = {width: 60, height: 60};
    private _cellSize: Size;
    private _cell: boolean[][];
    private _walker = new Point();

    constructor(layer: CanvasLayer) {
        super(layer);
        this._cell = [];
        this._cellSize = {
            width: layer.width / this._size.width,
            height: layer.height / this._size.height,
        }
        for (let y = 0; y < this._size.height; y++) {
            this._cell.push([]);
            for (let x = 0; x < this._size.width; x++) {
                this._cell[y].push(Math.random() > 0.8);
            }
        }
        this._walker = new Point(Math.floor(Math.random() * this._size.width), Math.floor(Math.random() * this._size.height))
    }


    checkCell(x: number, y: number): boolean {
        const up = y == 0 ? this._cell[y + this._size.height - 1][x] : this._cell[y - 1][x];
        const down = y == this._size.height - 1 ? this._cell[0][x] : this._cell[y + 1][x];
        const left = x == 0 ? this._cell[y][x + this._size.width - 1] : this._cell[y][x - 1];
        const right = x == this._size.width - 1 ? this._cell[y][0] : this._cell[y][x + 1];
        let count = 0;
        [up, down, left, right].forEach(v => {
            if (v) count++;
        })

        if (Math.abs(x - this._walker.x) + Math.abs(y - this._walker.y) === 6) return Math.random() > 0.4;
        if (Math.abs(x - this._walker.x) + Math.abs(y - this._walker.y) === 3) return Math.random() > 0.3;
        if (Math.abs(x - this._walker.x) + Math.abs(y - this._walker.y) === 2) return Math.random() > 0.1;
        if (Math.abs(x - this._walker.x) + Math.abs(y - this._walker.y) === 1) return false;
        //if (Math.random() > 0.8) return false;

        if (count === 3) {
            return true;
        } else if (count === 2) {
            return this._cell[y][x];
        } else if (count === 1) {
            return Math.random() > 0.73;
        } else {
            return false;
        }
    }

    _prevWalk = new Point(1, 0);
    randomWalk() {
        if (Math.random() > 0.9) {
            if (Math.random() > 0.8) {
                this._prevWalk = this._prevWalk.reverse();
            } else {
                this._prevWalk = new Point(this._prevWalk.y, this._prevWalk.x);
            }
        }
        this._walker.add(this._prevWalk);
        if (this._walker.x > this._size.width - 1) {
            this._walker.x = 0;
        }
        if (this._walker.x < 0) {
            this._walker.x = this._size.width - 1;
        }
        if (this._walker.y > this._size.height - 1) {
            this._walker.y = 0;
        }
        if (this._walker.y < 0) {
            this._walker.y = this._size.height - 1;
        }
    }

    override update() {
        super.update();
        this.randomWalk();
        const newCells: boolean[][] = [];
        for (let y = 0; y < this._size.width; y++) {
            newCells.push([]);
            for (let x = 0; x < this._size.height; x++) {
                newCells[y].push(this.checkCell(x, y));
            }
        }
        this._cell = newCells;
    }

    override draw() {
        super.draw();
        const ctx = this.layer.context;
        const [w, h] = [this._size.width, this._size.height];

        this._cell.forEach((raw, y) => {
            raw.forEach((dot, x) => {
                if (x == this._walker.x && y == this._walker.y) {
                    ctx.fillStyle = "red";
                } else {
                    ctx.fillStyle = dot ? "black" : "white";
                }
                ctx.fillRect(x * this._cellSize.width, y * this._cellSize.height, this._cellSize.width+1, this._cellSize.height+1);
            })
        })
    }

}
