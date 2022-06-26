import {Directions} from "../Display/Point";
import {Size} from "../Display/Size";

export type Field = {
    size: Size;
    tileSize: number;
    render: (ctx: CanvasRenderingContext2D) => void;
    update: (delta: number) => void;
    tiles: number[][];
}

export type FieldOption = {
    canvasSize: Size;
}

const fieldSize: Size = {
    width: 12,
    height: 9
}

const NegativeDirections = {
    up: 0b0111,
    right: 0b1011,
    down: 0b1101,
    left: 0b1110
}

export const createField: (fieldOption: FieldOption) => Field = (fieldOption) => {

    let tileSize = Math.floor(fieldOption.canvasSize.width / fieldSize.width);

    let tiles = createComponentTiles();

    const field: Field = {
        size: fieldSize,
        tileSize: tileSize,
        tiles: tiles,
        render: (ctx) => {
            const {size, tileSize} = field;
            ctx.clearRect(
                0,
                0,
                size.width * tileSize,
                size.height * tileSize
            );
            ctx.strokeStyle = "rgb(200, 200, 230)"
            ctx.lineWidth = 10;
            for (let x = 0; x < size.width; x++) {
                for (let y = 0; y < size.height; y++) {
                    const tile = field.tiles[y][x];
                    const [left, right, top, bottom] = [x * tileSize, (x + 1) * tileSize, y * tileSize, (y + 1) * tileSize];
                    ctx.beginPath()
                    if ((tile & Directions.up) > 0) {
                        ctx.moveTo(left, top);
                        ctx.lineTo(right, top);
                    }
                    if ((tile & Directions.right) > 0) {
                        ctx.moveTo(right, top);
                        ctx.lineTo(right, bottom);
                    }
                    if ((tile & Directions.down) > 0) {
                        ctx.moveTo(right, bottom);
                        ctx.lineTo(left, bottom);
                    }
                    if ((tile & Directions.left) > 0) {
                        ctx.moveTo(left, bottom);
                        ctx.lineTo(left, top);
                    }
                    ctx.stroke();
                }
            }
        },
        update: () => {

        }
    }

    return field;
}

function createRandomTile() {
    return Math.floor(Math.random() * 14 + 1);
}

/**
 * タイル設定
 */
const createTiles = () => {
    let tiles: number[][] = [];
    const f = () => {
        for (let i = 0; i < fieldSize.height; i++) {
            tiles.push([]);
            for (let j = 0; j < fieldSize.width; j++) {
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

const createComponentTiles = () => {
    const SectionSize = 3;

    let sections: number[][][][] = [];
    for (let h = 0; h < fieldSize.height / SectionSize; h++) {
        sections.push([]);
        for (let w = 0; w < fieldSize.width / SectionSize; w++) {
            let outerWall = 0;
            if (h == 0) outerWall |= Directions.up;
            if (h == fieldSize.height / SectionSize - 1) outerWall |= Directions.down;
            if (w == 0) outerWall |= Directions.left;
            if (w == fieldSize.width / SectionSize - 1) outerWall |= Directions.right;
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
            if ((outWalls & Directions.up) > 0 && h == 0) tile |= Directions.up;
            if ((outWalls & Directions.left) > 0 && w == 0) tile |= Directions.left;
            if ((outWalls & Directions.down) > 0 && h == size - 1) tile |= Directions.down;
            if ((outWalls & Directions.right) > 0 && w == size - 1) tile |= Directions.right;
            section[h].push(tile);
        }
    }

    return section;
}


function setOuterWall(tiles: number[][]) {
    for (let i = 0; i < fieldSize.height; i++) {
        for (let j = 0; j < fieldSize.width; j++) {
            if (j == 0) tiles[i][j] = tiles[i][j] | Directions.left;
            if (j == fieldSize.width - 1) tiles[i][j] = tiles[i][j] | Directions.right;
            if (i == 0) tiles[i][j] = tiles[i][j] | Directions.up;
            if (i == fieldSize.height - 1) tiles[i][j] = tiles[i][j] | Directions.down;
        }
    }
    return true;
}

function checkOpenAndClose(tiles: number[][]) {
    for (let i = 0; i < fieldSize.height; i++) {
        for (let j = 0; j < fieldSize.width; j++) {
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
    let i = 0;
    while (!checkOpenAndClose(tiles)) {
        for (let i = 0; i < fieldSize.height; i++) {
            for (let j = 0; j < fieldSize.width; j++) {
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
    for (let i = 0; i < fieldSize.height; i++) {
        for (let j = 0; j < fieldSize.width; j++) {

            const tile = tiles[i][j];

            if (j < fieldSize.width - 1) {
                if ((tile & Directions.right) > 0) {
                    tiles[i][j + 1] = tiles[i][j + 1] | Directions.left;
                } else {
                    tiles[i][j + 1] = tiles[i][j + 1] & NegativeDirections.left;
                }
            }

            if (i < fieldSize.height - 1) {
                if ((tile & Directions.down) > 0) {
                    tiles[i + 1][j] = tiles[i + 1][j] | Directions.up;
                } else {
                    tiles[i + 1][j] = tiles[i + 1][j] & NegativeDirections.up;
                }
            }

        }
    }
}

