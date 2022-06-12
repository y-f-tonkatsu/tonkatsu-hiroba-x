import {DisplayObject} from "../Display/DisplayObject";
import {Field} from "./Field";

export const createMover: (field: Field, imageList: HTMLImageElement[], id: number) => DisplayObject
    = (field, imageList, id) => {

    const mover: DisplayObject & { moving: number, coordination: { x: number, y: number }, direction: { x: number, y: number } } = {
        coordination: {
            x: 1 + id, y: 4
        },
        position: {
            x: 1 + id, y: 4
        },
        direction: {
            x: 0, y: 0
        },
        moving: 0,
        render: ctx => {
            if (!ctx) return;
            ctx.fillStyle = "rgb(200, 200, 120)";

            let image = imageList[id - 1];
            ctx.drawImage(image,
                mover.position.x * field.tileSize,
                mover.position.y * field.tileSize,
                field.tileSize,
                field.tileSize
            )
        },
        update: delta => {
            let {x, y} = mover.coordination;
            const tile = field.tiles[y][x];

            if (mover.moving == 0) {
                mover.direction = {x: 0, y: 0};
                const numList = [1, 2, 4, 8];
                while (numList.length > 0) {
                    const i = Math.floor(Math.random() * numList.length);
                    const num = numList[i];
                    numList.splice(i, 1);
                    if ((tile & num) == 0) {
                        if (num === 1) {
                            mover.direction.x = -1;
                        } else if (num === 2) {
                            mover.direction.y = 1;
                        } else if (num === 4) {
                            mover.direction.x = 1;
                            x += 1;
                        } else if (num === 8) {
                            mover.direction.y = -1;
                        }
                        break;
                    }
                }

                /*
                if (x > field.width) x -= (field.width);
                if (y > field.height) y -= (field.height);
                if (x < 0) x += (field.width);
                if (y < 0) y += (field.height);
                 */
            }

            const rate = 24;
            mover.position.x += mover.direction.x / rate;
            mover.position.y += mover.direction.y / rate;
            mover.moving++;
            if (mover.moving === rate) {
                mover.moving = 0;
                mover.coordination.x += mover.direction.x;
                mover.coordination.y += mover.direction.y;
            }

        }
    };

    return mover;
}

