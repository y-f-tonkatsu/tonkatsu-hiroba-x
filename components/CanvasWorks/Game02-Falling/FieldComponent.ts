import {DisplayObject} from "../../../TonkatsuDisplayLib/Display/DisplayObject";
import {CanvasLayer} from "../../../TonkatsuDisplayLib/Display/CanvasLayer";
import {Size} from "../../../TonkatsuDisplayLib/Display/Size";
import {Point} from "../../../TonkatsuDisplayLib/Display/Point";
import {rnd} from "./Game02Falling";
import {Component} from "../../../TonkatsuDisplayLib/BasicComponents/Component";
import {GameUIComponent} from "./GameUIComponent";
import {EffectComponent} from "./EffectComponent";

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
    flash: {
        num: number,
        direction: Point,
    }
}

/**
 * ブロックの画像一覧を表す配列。
 * 0 はブロックのない空間。
 */
export const BLOCK_IMAGES = [
    {
        color: "none",
        index: -1,
    }, {
        color: "blue",
        index: 0,
    }, {
        color: "yellow",
        index: 1,
    }, {
        color: "green",
        index: 2,
    }, {
        color: "teal",
        index: 3
    }, {
        color: "orange",
        index: 4
    }, {
        color: "pink",
        index: 5
    },
];

export class FieldComponent extends Component {
    set fieldSize(value: Size) {
        this._fieldSize = value;
        this._cellSize = {
            width: this._fieldSize.width / this._numCells.width,
            height: this._fieldSize.height / this._numCells.height,
        }
    }

    set offsetSize(value: Point) {
        this._offsetSize = value;
        this.transform.position = this._offsetSize;
    }

    private _numCells: Size = {width: 8, height: 14};
    private _fieldSize: Size = {width: 0, height: 0};
    private _offsetSize: Point = new Point(0, 0);
    private _cellSize: Size = {width: 0, height: 0};
    private _cells: Cell[][] = [];
    private _currentBlocks = {
        position: new Point(0, 0),
        subPosition: new Point(0, 0),
        direction: ROTATION[0].clone(),
        colors: [1, 2],
        rotation: 0,
        visible: true
    };
    private _nextBlocks = [1, 2];
    private _layer: CanvasLayer;
    private _gameUIComponent: GameUIComponent;
    private _effectComponent: EffectComponent;

    private static readonly START_POSITION: Point = new Point(3, 0);
    private static readonly START_DIRECTION: Point = ROTATION[0].clone();

    constructor(parent: DisplayObject, gameUIComponent: GameUIComponent, effectComponent: EffectComponent) {
        super(parent);
        this._layer = parent.layer;
        this._gameUIComponent = gameUIComponent;
        this._effectComponent = effectComponent;
        this.initCells();
        this.resetNextBlocks();
        this.resetCurrentBlocks(true);
        this.resetNextBlocks();
    }

    //初期化

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
                    flash: {
                        num: 0,
                        direction: Point.zero(),
                    }
                });
            }
        }
    }

    /**
     * 次の落下ブロックを初期化する
     */
    resetCurrentBlocks(visible: boolean) {
        this._currentBlocks = {
            position: FieldComponent.START_POSITION.clone(),
            direction: FieldComponent.START_DIRECTION.clone(),
            subPosition: new Point(0, 0),
            colors: this._nextBlocks,
            rotation: 0,
            visible
        }
    }

    resetNextBlocks(){
        this._nextBlocks = [rnd(BLOCK_IMAGES.length - 1) + 1, rnd(BLOCK_IMAGES.length - 1) + 1];
        this._gameUIComponent.setNextBlockImages(
            this.getBlockImage(this._nextBlocks[0]),
            this.getBlockImage(this._nextBlocks[1])
        );
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
        if (this.canRotateCurrent(-1)) {
            this.rotateCurrent(-1);
        }
    }

    /**
     * 右回転
     */
    rotateRight() {
        if (this.canRotateCurrent(1)) {
            this.rotateCurrent(1);
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

    getCell(x: number, y: number): Cell | null {
        if (x < 0 || x > this._numCells.width - 1 || y < 0 || y > this._numCells.height - 1) {
            return null;
        } else {
            return this._cells[y][x];
        }
    }

    checkGameOver(): boolean {
        const cell1 = this.getCell(FieldComponent.START_POSITION.x, FieldComponent.START_POSITION.y);
        const cell2 = this.getCell(FieldComponent.START_POSITION.x + FieldComponent.START_DIRECTION.x,
            FieldComponent.START_POSITION.y + FieldComponent.START_DIRECTION.y);
        if (cell1 == null || cell2 == null) return false;
        return cell1.color !== 0 || cell2.color !== 0;
    }

    /**
     * 全てのセルについて、
     * 落下が発生するかどうかをチェックする。
     */
    checkDrop() {
        let flg = false;
        for (let x = 0; x < this._numCells.width; x++) {
            let drop = 0;
            for (let y = this._numCells.height - 1; y >= 0; y--) {

                const cell = this._cells[y][x];

                if (cell.color === 0) {
                    cell.direction.reset();
                    drop++;
                } else {
                    if (drop > 0) flg = true;
                    cell.direction = new Point(0, drop);
                }

            }
        }
        return flg;
    }

    /**
     * ラインが揃っているかチェック
     */
    checkFlash(): boolean {
        let flg = false
        for (let x = 0; x < this._numCells.width; x++) {
            for (let y = 0; y < this._numCells.height; y++) {
                const cell = this.getCell(x, y);
                if (!cell || cell.color == 0) continue;

                const check = (cood: Point, v: Point): boolean => {
                    const current = this.getCell(cood.x, cood.y);
                    const target = this.getCell(cood.x + v.x, cood.y + v.y);
                    if (current == null || target == null) {
                        return false;
                    } else {
                        return current.color == target.color;
                    }
                }

                [new Point(1, 0), new Point(0, 1), new Point(1, 1), new Point(-1, 1)].forEach(v => {
                    let r = 1;
                    const checkR = (cood: Point, v: Point): boolean => {
                        if (check(cood, v)) {
                            r++;
                            return checkR(Point.combine(cood, v), v);
                        } else {
                            return false;
                        }
                    }
                    checkR(new Point(x, y), v);
                    if (r >= 3) {
                        cell.flash = {
                            num: r,
                            direction: v
                        }
                        flg = true;
                        console.log("flash!", cell.flash);
                    }
                })

            }
        }
        return flg;
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
     * 現在のブロックの落下を1フレーム分進める。
     */
    progressDown() {
        this._currentBlocks.subPosition.add(new Point(0, 0.1));
        if (this._currentBlocks.subPosition.y >= 1) {
            this._currentBlocks.subPosition = new Point(0, 0);
            this._currentBlocks.position.add(new Point(0, 1));
        }
    }

    /**
     * 全固定ブロックの落下を1フレーム分進める。
     */
    private _dropProgress = 0;

    progressDrop(): boolean {
        let flg = false;
        this._dropProgress += 0.05;
        if (this._dropProgress >= 1) {
            flg = true;
            this._dropProgress = 0;
        }
        for (let x = 0; x < this._numCells.width; x++) {
            for (let y = this._numCells.height - 1; y >= 0; y--) {
                const cell = this._cells[y][x];
                if (cell.color !== 0) {
                    if (flg && cell.direction.y > 0) {
                        this._cells[y + cell.direction.y][x].color = cell.color;
                        cell.color = 0;
                        cell.subPosition.reset();
                        cell.direction.reset();
                    } else {
                        cell.subPosition = new Point(0, cell.direction.y * this._dropProgress * this._cellSize.height);
                    }
                }
            }
        }
        return flg;
    }

    progressFlash(chain:number = 1): boolean {
        let flg = false
        for (let x = 0; x < this._numCells.width; x++) {
            for (let y = this._numCells.height - 1; y >= 0; y--) {
                const cell = this._cells[y][x];
                if (cell == null) continue;
                const num = cell.flash.num;
                if (num === 0) continue;
                for (let i = 0; i < num; i++) {
                    const target = this._cells[y + cell.flash.direction.y * i][x + cell.flash.direction.x * i];
                    target.color = 0;
                    this._gameUIComponent.addScore(chain);
                }
                flg = true;
            }
        }
        if (flg) {
            for (let x = 0; x < this._numCells.width; x++) {
                for (let y = this._numCells.height - 1; y >= 0; y--) {
                    const cell = this._cells[y][x];
                    cell.flash = {
                        num: 0,
                        direction: Point.zero()
                    }
                }
            }
        }
        return flg;
    }

    //描画

    override draw() {
        super.draw();
        const ctx = this._layer.context;
        ctx.save();
        ctx.translate(this._offsetSize.x, this._offsetSize.y);
        this.drawCurrentBlocks(ctx);
        this.drawStaticBlocks(ctx);
        ctx.restore();
    }

    private getBlockImage(color: number) {
        const img = this.parent.imageFileList.filter(item => item.id == `block${color}`)[0];
        return img.element;
    }

    /**
     * 落下ブロックを描画
     */
    private drawCurrentBlocks(ctx: CanvasRenderingContext2D) {
        if (!this._currentBlocks.visible) return;

        const subP = Point.multiply(this._currentBlocks.subPosition, this._cellSize.height);

        const x1 = this._cellSize.width * this._currentBlocks.position.x + subP.x;
        const y1 = this._cellSize.height * this._currentBlocks.position.y + subP.y;
        ctx.drawImage(this.getBlockImage(this._currentBlocks.colors[0]), x1, y1, this._cellSize.width, this._cellSize.height);

        const x2 = this._cellSize.width * Point.combine(this._currentBlocks.position, this._currentBlocks.direction).x + subP.x;
        const y2 = this._cellSize.height * Point.combine(this._currentBlocks.position, this._currentBlocks.direction).y + subP.y;
        ctx.drawImage(this.getBlockImage(this._currentBlocks.colors[1]), x2, y2, this._cellSize.width, this._cellSize.height);
    }

    /**
     * 固定ブロックを描画
     */
    private drawStaticBlocks(ctx: CanvasRenderingContext2D) {
        for (let y = 0; y < this._numCells.height; y++) {
            for (let x = 0; x < this._numCells.width; x++) {
                const cell = this._cells[y][x];
                if (cell.color === 0) continue;
                ctx.drawImage(this.getBlockImage(cell.color),
                    this._cellSize.width * x + cell.subPosition.x,
                    this._cellSize.height * y + cell.subPosition.y,
                    this._cellSize.width, this._cellSize.height);
            }
        }
    }

}