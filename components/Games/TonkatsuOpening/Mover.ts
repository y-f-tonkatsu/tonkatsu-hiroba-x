import {DisplayObject} from "../Display/DisplayObject";
import {Field} from "./Field";
import {addPoints, Directions, DirectionVectors, isSamePoint, Point, Zero} from "../Display/Point";

export type Mover = DisplayObject & {
}

export type MoverOptions = {
    field: Field,
    imageList: HTMLImageElement[],
    id: number,
    displayList: DisplayObject[]
}

export const createMover: (options: MoverOptions) => Mover
    = (options) => {

    const {field, imageList, id, displayList} = options;

    const mover: Mover = {
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
                const numList = [Directions.left, Directions.down, Directions.right, Directions.up];
                while (numList.length > 0) {
                    const i = Math.floor(Math.random() * numList.length);
                    const num = numList[i];
                    numList.splice(i, 1);
                    if ((tile & num) === 0) {
                        let flg = false
                        for (const [k, v] of Object.entries(Directions)) {
                            if (k !== "up" && k !== "down" && k !== "left" && k !== "right") continue;
                            if (num !== v) continue;
                            const direction = DirectionVectors[k];
                            if (!isOccupied(mover.coordination, addPoints(mover.coordination, direction))) {
                                mover.direction = direction;
                                flg = true;
                                break;
                            }
                        }
                        if (flg) break;
                    }
                }

            }

            const rate = 24;
            mover.position.x += mover.direction.x / rate;
            mover.position.y += mover.direction.y / rate;
            mover.moving++;
            if (mover.moving === rate) {
                mover.moving = 0;
                mover.coordination.x += mover.direction.x;
                mover.coordination.y += mover.direction.y;
                mover.direction = {x: 0, y: 0}
            }

        }
    };

    const isOccupied = (current: Point, next: Point) => {
        let value = false;
        displayList.forEach(target => {
            const targetCurrent = target.coordination;
            const targetNext = addPoints(target.coordination, target.direction);
            //同じ位置への移動禁止
            if (isSamePoint(targetNext, next)) {
                value = true;
            }
            //位置入れ替え禁止
            if (isSamePoint(targetNext, current) && isSamePoint(targetCurrent, next)) {
                value = true;
            }
            if (isSamePoint(target.direction, Zero) && isSamePoint(next, targetCurrent)) {
                value = true;
            }
        });
        return value;
    }

    return mover;
}

