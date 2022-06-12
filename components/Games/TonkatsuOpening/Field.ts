export type Field = {
    width: number;
    height: number;
    tileSize: number;
    render: (ctx: CanvasRenderingContext2D) => void;
    update: (delta: number) => void;
    tiles: number[][];
}

export type FieldOption = {
    canvasWidth: number;
    canvasHeight: number;
}

const TILE_SIZE: number = 100;

export const createField: (fieldOption: FieldOption) => Field = (fieldOption) => {

    const tiles = [
        [0b1001, 0b1010, 0b1010, 0b1000, 0b1000, 0b1000, 0b1000, 0b1000, 0b1000, 0b1100],
        [0b0101, 0b1001, 0b1010, 0b0000, 0b0000, 0b0000, 0b0000, 0b0000, 0b0000, 0b0100],
        [0b0001, 0b0100, 0b1001, 0b0000, 0b0000, 0b0000, 0b0000, 0b0000, 0b0000, 0b0100],
        [0b0101, 0b0101, 0b0001, 0b0000, 0b0000, 0b0000, 0b0000, 0b0000, 0b0000, 0b0100],
        [0b0001, 0b0000, 0b0000, 0b0000, 0b0000, 0b0000, 0b0000, 0b0000, 0b0000, 0b0100],
        [0b0001, 0b0000, 0b0000, 0b0000, 0b0000, 0b0000, 0b0000, 0b0000, 0b0000, 0b0100],
        [0b0001, 0b0000, 0b0000, 0b0000, 0b0000, 0b0000, 0b0000, 0b0000, 0b0000, 0b0100],
        [0b0011, 0b0010, 0b0010, 0b0010, 0b0010, 0b0010, 0b0010, 0b0010, 0b0010, 0b0110,]
    ]


    const field: Field = {
        width: fieldOption.canvasWidth / TILE_SIZE,
        height: fieldOption.canvasHeight / TILE_SIZE,
        tileSize: TILE_SIZE,
        tiles: tiles,
        render: (ctx) => {
            const size = field.tileSize;
            ctx.clearRect(
                0,
                0,
                field.width * field.tileSize,
                field.height * field.tileSize
            );
            ctx.strokeStyle = "rgb(200, 200, 230)"
            ctx.lineWidth = 10;
            for (let x = 0; x < field.width; x++) {
                for (let y = 0; y < field.height; y++) {
                    const tile = field.tiles[y][x];
                    const [left, right, top, bottom] = [x * size, (x + 1) * size, y * size, (y + 1) * size];
                    ctx.beginPath()
                    if ((tile & 0b1000) > 0) {
                        ctx.moveTo(left, top);
                        ctx.lineTo(right, top);
                    }
                    if ((tile & 0b0100) > 0) {
                        ctx.moveTo(right, top);
                        ctx.lineTo(right, bottom);
                    }
                    if ((tile & 0b0010) > 0) {
                        ctx.moveTo(right, bottom);
                        ctx.lineTo(left, bottom);
                    }
                    if ((tile & 0b0001) > 0) {
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