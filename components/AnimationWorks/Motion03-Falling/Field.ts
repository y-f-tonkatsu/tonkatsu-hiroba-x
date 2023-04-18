import {DisplayObject} from "../../../TonkatsuDisplayLib/Display/DisplayObject";
import {CanvasLayer} from "../../../TonkatsuDisplayLib/Display/CanvasLayer";
import {Size} from "../../../TonkatsuDisplayLib/Display/Size";
import {Point} from "../../../TonkatsuDisplayLib/Display/Point";
import {rnd} from "./Mo03Falling";

/**
 * 回転の状態毎のサブブロックの位置をベクトルで表す。
 */
export const ROTATION = [
    new Point(1, 0),
    new Point(0, 1),
    new Point(-1, 0),
    new Point(0, -1),
];

/**
 * セルを表す型
 */
export type Cell = {
    color: number,
    position: Point,
    subPosition: Point,
    direction: Point,
}

/**
 * ブロックの画像一覧を表す配列。
 * 0 はブロックのない空間。
 */
export const BLOCK_IMAGES = [
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

export class Field extends DisplayObject {

    get offsetSize(): Point {
        return this._offsetSize;
    }

    private _numCells: Size = {width: 12, height: 20};
    private _fieldSize: Size = {width: 0, height: 0};
    private _offsetSize: Point = new Point(0, 0);
    private _cellSize: Size = {width: 0, height: 0};
    private _cells: Cell[][] = [];
    private _currentBlocks = {
        position: new Point(0, 0),
        subPosition: new Point(0, 0),
        direction: ROTATION[0].clone(),
        colors: [1, 2],
        rotation: 0
    };

    constructor(layer: CanvasLayer) {
        super(layer);
        this._offsetSize = new Point(layer.width * 0.5 / 13, layer.height * 2 / 23);
        this.initFieldSize(layer);
        this.initCells();
        this.resetCurrentBlocks();
    }

    //初期化

    /**
     * レイヤーの大きさに対して適切なフィールドサイズを計算し、設定する。
     */
    private initFieldSize(layer: CanvasLayer) {
        const width = layer.width * 12 / 13;
        const height = width / 12 * 20;
        this._fieldSize = {width, height};
        this._cellSize = {
            width: this._fieldSize.width / this._numCells.width,
            height: this._fieldSize.height / this._numCells.height,
        }
    }

    /**
     * セル状態を初期化
     */
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

    /**
     * 次の落下ブロックを初期化する
     */
    resetCurrentBlocks() {
        this._currentBlocks = {
            position: new Point(5, 0),
            subPosition: new Point(0, 0),
            direction: ROTATION[0].clone(),
            colors: [rnd(BLOCK_IMAGES.length - 1) + 1, rnd(BLOCK_IMAGES.length - 1) + 1],
            rotation: 0
        }
    }

    //操作

    override update() {
        super.update();

    }

    /**
     * 落下ブロックを1マス下に移動
     */
    down() {
        const d = new Point(0, 1);
        if (this.canMoveCurrent(d)) {
            this._currentBlocks.position.add(d);
            this._currentBlocks.subPosition = Point.zero();
        }
    }

    /**
     * 落下ブロックを1マス左に移動
     */
    left() {
        const d = new Point(-1, 0);
        if (this.canMoveCurrent(d))
            this._currentBlocks.position.add(d);
    }

    /**
     * 落下ブロックを1マス右に移動
     */
    right() {
        const d = new Point(1, 0);
        if (this.canMoveCurrent(d))
            this._currentBlocks.position.add(d);
    }

    /**
     * 落下ブロックが指定座標に移動可能かチェックする。
     * 2つの落下ブロックのうち一方でも他のブロックに重なるなら false.
     */
    canMoveCurrent(d: Point): boolean {
        return this.canMove(this._currentBlocks.position, d) &&
            this.canMove(Point.combine(this._currentBlocks.position, this._currentBlocks.direction), d);
    }

    /**
     * ブロック単体が指定座標 p からベクトル d 移動することが可能かチェックする。
     * d を指定しない場合、単に p が占有されていないかをチェックする。
     */
    canMove(p: Point, d: Point = Point.zero()): boolean {
        if (p.x + d.x < 0 || p.x + d.x + 1 > this._numCells.width) return false;
        if (p.y + d.y < 0 || p.y + d.y + 1 > this._numCells.height) return false;
        return this._cells[p.y + d.y][p.x + d.x].color === 0;
    }


    //回転

    /**
     * 左回転
     */
    rotateLeft() {
        if (this.canRotateCurrent(1)) {
            this.rotateCurrent(1);
        }
    }

    /**
     * 右回転
     */
    rotateRight() {
        if (this.canRotateCurrent(-1)) {
            this.rotateCurrent(-1);
        }
    }

    /**
     * 回転
     * @param d {number} 正数は時計回り、負数は右回りで 1 ごとに 90° 回転させる。
     */
    rotateCurrent(d: number) {
        const newR = (this._currentBlocks.rotation + d + ROTATION.length) % ROTATION.length;
        this._currentBlocks.rotation = newR;
        this._currentBlocks.direction = ROTATION[newR].clone();
    }

    /**
     * 回転が可能かチェック
     * @param d {number} 正数は時計回り、負数は右回りで 1 ごとに 90° 回転させる。
     * @return boolean 回転可能なら true
     */
    canRotateCurrent(d: number): boolean {
        const newR = (this._currentBlocks.rotation + d + ROTATION.length) % ROTATION.length;
        return this.canMove(this._currentBlocks.position, ROTATION[newR]);
    }

    /**
     * 全てのセルについて、
     * 落下が発生するかどうかをチェックする。
     */
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

    /**
     * 落下ブロックを固定ブロックに変える。
     * 落下ブロック自体は残る。
     */
    setCurrentToStatic() {
        const p1 = this._currentBlocks.position;
        const p2 = Point.combine(p1, this._currentBlocks.direction);
        this._cells[p1.y][p1.x].color = this._currentBlocks.colors[0];
        this._cells[p2.y][p2.x].color = this._currentBlocks.colors[1];
    }

    /**
     * ブロックの落下を1フレーム分進める。
     */
    progressDown() {
        this._currentBlocks.subPosition.add(new Point(0, 0.2));
        if (this._currentBlocks.subPosition.y >= 1) {
            this._currentBlocks.subPosition = new Point(0, 0);
            this._currentBlocks.position.add(new Point(0, 1));
        }
    }

    //描画

    override draw() {
        super.draw();
        const ctx = this.layer.context;
        this.drawBG(ctx);
        this.drawStaticBlocks(ctx);
        this.drawCurrentBlocks(ctx);
    }

    /**
     * 背景を描画
     */
    private drawBG(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "#aaaaaa";
        ctx.moveTo(0, 0);
        ctx.fillRect(0, 0, this.layer.width, this.layer.height);
        ctx.fillStyle = "#333344";
        ctx.moveTo(this._offsetSize.x, this._offsetSize.y);
        ctx.fillRect(this._offsetSize.x, this._offsetSize.y, this._fieldSize.width, this._fieldSize.height);
    }

    /**
     * 落下ブロックを描画
     */
    private drawCurrentBlocks(ctx: CanvasRenderingContext2D) {

        const subP = Point.multiply(this._currentBlocks.subPosition, this._cellSize.height);

        ctx.fillStyle = BLOCK_IMAGES[this._currentBlocks.colors[0]].color;
        const x1 = this._offsetSize.x + this._cellSize.width * this._currentBlocks.position.x + subP.x;
        const y1 = this._offsetSize.y + this._cellSize.height * this._currentBlocks.position.y + subP.y;
        ctx.fillRect(x1, y1, this._cellSize.width, this._cellSize.height);

        ctx.fillStyle = BLOCK_IMAGES[this._currentBlocks.colors[1]].color;
        const x2 = this._offsetSize.x + this._cellSize.width * Point.combine(this._currentBlocks.position, this._currentBlocks.direction).x + subP.x;
        const y2 = this._offsetSize.y + this._cellSize.height * Point.combine(this._currentBlocks.position, this._currentBlocks.direction).y + subP.y;
        ctx.fillRect(x2, y2, this._cellSize.width, this._cellSize.height);

    }

    /**
     * 固定ブロックを描画
     */
    private drawStaticBlocks(ctx: CanvasRenderingContext2D) {
        for (let y = 0; y < this._numCells.height; y++) {
            for (let x = 0; x < this._numCells.width; x++) {
                const cell = this._cells[y][x];
                ctx.fillStyle = BLOCK_IMAGES[cell.color].color;
                ctx.fillRect(
                    this._offsetSize.x + this._cellSize.width * x + cell.subPosition.x,
                    this._offsetSize.y + this._cellSize.height * y + cell.subPosition.y,
                    this._cellSize.width, this._cellSize.height);
            }
        }
    }

}