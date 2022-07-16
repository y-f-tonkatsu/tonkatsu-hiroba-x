import {Directions, Point} from "../../Display/Point";
import {Size} from "../../Display/Size";
import {DisplayObject} from "../../Display/DisplayObject";
import {Component} from "../Component";

export type Coordinated = {
    coordination: Point;
    direction: Point;
}

export class CoordinatedFieldComponent extends Component {
    tileNum: Size;
    tileSize: number;
    tiles: number[][] = [[]];
    occupants: Coordinated[] = [];

    constructor(parent: DisplayObject, tileNum: Size, tileSize: number) {
        super(parent);
        this.tileNum = tileNum;
        this.tileSize = tileSize;
        this.tiles = createTiles(this.tileNum);
    }

    override update = (delta: number) => {
        super.update(delta);
    }

    override render = (ctx: CanvasRenderingContext2D) => {
        super.render(ctx);
        const {tileNum, tileSize, tiles} = this;
        ctx.clearRect(
            0,
            0,
            tileNum.width * tileSize,
            tileNum.height * tileSize
        );
        ctx.strokeStyle = "rgb(200, 200, 230)"
        ctx.lineWidth = 10;
        for (let x = 0; x < tileNum.width; x++) {
            for (let y = 0; y < tileNum.height; y++) {
                const tile = tiles[y][x];
                const [left, right, top, bottom] = [x * tileSize, (x + 1) * tileSize, y * tileSize, (y + 1) * tileSize];
                ctx.beginPath()
                if ((tile & Directions.UP) > 0) {
                    ctx.moveTo(left, top);
                    ctx.lineTo(right, top);
                }
                if ((tile & Directions.RIGHT) > 0) {
                    ctx.moveTo(right, top);
                    ctx.lineTo(right, bottom);
                }
                if ((tile & Directions.DOWN) > 0) {
                    ctx.moveTo(right, bottom);
                    ctx.lineTo(left, bottom);
                }
                if ((tile & Directions.LEFT) > 0) {
                    ctx.moveTo(left, bottom);
                    ctx.lineTo(left, top);
                }
                ctx.stroke();
            }
        }
    }

    public addOccupants(occupant: Coordinated) {
        this.occupants.push(occupant);
    }

    public isOccupied (current: Point, next: Point) {
        let value = false;
        this.occupants.forEach(target => {
            const targetCurrent = target.coordination;
            const targetNext = Point.combine(target.coordination, target.direction);
            //同じ位置への移動禁止
            if (targetNext.equals(next)) {
                value = true;
            }
            //位置入れ替え禁止
            if (targetNext.equals(current) && targetCurrent.equals(next)) {
                value = true;
            }
            if (target.direction.isZero() && next.equals(targetCurrent)) {
                value = true;
            }
        });
        return value;
    }

}


const NegativeDirections = {
    UP: 0b0111,
    RIGHT: 0b1011,
    DOWN: 0b1101,
    LEFT: 0b1110
}

/**
 * タイル設定
 */
const createTiles = (tileNum: Size) => {
    let tiles: number[][] = [];
    const f = () => {
        for (let i = 0; i < tileNum.height; i++) {
            tiles.push([]);
            for (let j = 0; j < tileNum.width; j++) {
                let ran = createRandomTile();
                tiles[i].push(ran);
            }
        }
        fixOneWays(tiles);
        setOuterWall(tiles)
        fixOpenAndClose(tiles);
    }

    f();
    while (tiles === null) {
        f();
    }

    return tiles;
}

function createRandomTile() {
    return Math.floor(Math.random() * 14 + 1);
}


const createComponentTiles = (tileNum: Size) => {
    const SectionSize = 3;

    let sections: number[][][][] = [];
    for (let h = 0; h < tileNum.height / SectionSize; h++) {
        sections.push([]);
        for (let w = 0; w < tileNum.width / SectionSize; w++) {
            let outerWall = 0;
            if (h == 0) outerWall |= Directions.UP;
            if (h == tileNum.height / SectionSize - 1) outerWall |= Directions.DOWN;
            if (w == 0) outerWall |= Directions.LEFT;
            if (w == tileNum.width / SectionSize - 1) outerWall |= Directions.RIGHT;
            sections[h].push(createSection(SectionSize, outerWall));
        }
    }

    console.log(sections);

    let tiles: number[][] = [];
    let h = 0;
    sections.forEach(rank => {
        for (let i = 0; i < SectionSize; i++) {
            tiles.push([])
            let w = 0;
            rank.forEach(sectionRank => {
                for (let j = 0; j < SectionSize; j++) {
                    tiles[h * SectionSize + i][w * SectionSize + j] = sectionRank[i][j];
                }
                w++;
            })
        }
        h++;
    })

    console.log(tiles);

    return tiles;
}

const createSection = (size: number, outWalls: number) => {
    const section: number[][] = [];
    for (let h = 0; h < size; h++) {
        section.push([]);
        for (let w = 0; w < size; w++) {
            let tile = createRandomTile();
            if ((outWalls & Directions.UP) > 0 && h == 0) tile |= Directions.UP;
            if ((outWalls & Directions.LEFT) > 0 && w == 0) tile |= Directions.LEFT;
            if ((outWalls & Directions.DOWN) > 0 && h == size - 1) tile |= Directions.DOWN;
            if ((outWalls & Directions.RIGHT) > 0 && w == size - 1) tile |= Directions.RIGHT;
            section[h].push(tile);
        }
    }

    return section;
}

function getTileNumFromTiles(tiles: number[][]) {
    return {
        height: tiles.length,
        width: tiles[0].length
    }

}

function setOuterWall(tiles: number[][]) {
    const tileNum = getTileNumFromTiles(tiles);
    for (let i = 0; i < tileNum.height; i++) {
        for (let j = 0; j < tileNum.width; j++) {
            if (j == 0) tiles[i][j] = tiles[i][j] | Directions.LEFT;
            if (j == tileNum.width - 1) tiles[i][j] = tiles[i][j] | Directions.RIGHT;
            if (i == 0) tiles[i][j] = tiles[i][j] | Directions.UP;
            if (i == tileNum.height - 1) tiles[i][j] = tiles[i][j] | Directions.DOWN;
        }
    }
    return true;
}

function checkOpenAndClose(tiles: number[][]) {
    const tileNum = getTileNumFromTiles(tiles);
    for (let i = 0; i < tileNum.height; i++) {
        for (let j = 0; j < tileNum.width; j++) {
            if (isOpenOrClose(tiles[i][j])) {
                return false;
            }
        }
    }
    return true;
}

function isOpenOrClose(tile: number) {
    return tile === 0 ||
        tile === 0b1111 ||
        tile === 0b1110 ||
        tile === 0b1101 ||
        tile === 0b1011 ||
        tile === 0b0111;
}

function fixOpenAndClose(tiles: number[][]) {
    const tileNum = getTileNumFromTiles(tiles);
    let i = 0;
    while (!checkOpenAndClose(tiles)) {
        for (let i = 0; i < tileNum.height; i++) {
            for (let j = 0; j < tileNum.width; j++) {
                if (isOpenOrClose(tiles[i][j])) {
                    tiles[i][j] = Math.floor(Math.random() * 14 + 1);
                }
            }
        }
        fixOneWays(tiles);
        setOuterWall(tiles);
        i++;
        if (i > 1000) return null;
    }
    return tiles;
}

/**
 * 一方通行をなくす
 * @param tiles
 */
function fixOneWays(tiles: number[][]) {
    const tileNum = getTileNumFromTiles(tiles);
    for (let i = 0; i < tileNum.height; i++) {
        for (let j = 0; j < tileNum.width; j++) {

            const tile = tiles[i][j];

            if (j < tileNum.width - 1) {
                if ((tile & Directions.RIGHT) > 0) {
                    tiles[i][j + 1] = tiles[i][j + 1] | Directions.LEFT;
                } else {
                    tiles[i][j + 1] = tiles[i][j + 1] & NegativeDirections.LEFT;
                }
            }

            if (i < tileNum.height - 1) {
                if ((tile & Directions.DOWN) > 0) {
                    tiles[i + 1][j] = tiles[i + 1][j] | Directions.UP;
                } else {
                    tiles[i + 1][j] = tiles[i + 1][j] & NegativeDirections.UP;
                }
            }

        }
    }
}

