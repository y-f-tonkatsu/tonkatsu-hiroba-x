export class Point {
    x: number = 0;
    y: number = 0;

    constructor(x: number = 0, y: number = 0) {
        this.set(x, y);
    }

    static combine(a: Point, b: Point) {
        return new Point(a.x + b.x, a.y + b.y);
    }
    static multiply(a: Point, b: number) {
        return new Point(a.x * b, a.y * b);
    }

    static zero() {
        return new Point(0, 0);
    }

    clone() {
        return new Point(this.x, this.y);
    }

    reverse() {
        return new Point(-this.x, -this.y);
    }

    reset(){
        this.x = 0;
        this.y = 0;
    }

    isZero() {
        return this.x === 0 && this.y === 0;
    }

    set(x: number, y: number) {
        [this.x, this.y] = [x, y];
    }

    substitute(point: Point) {
        [this.x, this.y] = [point.x, point.y];
    }

    add(target: Point) {
        [this.x, this.y] = [this.x + target.x, this.y + target.y];
    }

    multiply(target: Point | number) {
        if (typeof target === "number") {
            [this.x, this.y] = [this.x * target, this.y * target];
        } else {
            [this.x, this.y] = [this.x * target.x, this.y * target.y];
        }
    }

    equals(target: Point) {
        return this.x === target.x && this.y === target.y;
    }
}

export type DirectionBits = 0b1000 | 0b0100 | 0b0010 | 0b0001;

export const Directions = {
    UP: 0b1000,
    RIGHT: 0b0100,
    DOWN: 0b0010,
    LEFT: 0b0001
} as const;

export const UnitVectors = {
    UP: new Point(0, -1),
    RIGHT: new Point(1, 0),
    DOWN: new Point(0, 1),
    LEFT: new Point(-1, 0)
} as const;

export const DirectionToVector = (direction: DirectionBits) => {
    return {
        0b1000: UnitVectors.UP,
        0b0100: UnitVectors.RIGHT,
        0b0010: UnitVectors.DOWN,
        0b0001: UnitVectors.LEFT
    }[direction];
}

export const VectorToDirection = (vector: Point): DirectionBits | 0 => {
    if (vector.x > 0) {
        return Directions.RIGHT
    } else if (vector.x < 0) {
        return Directions.LEFT
    } else {
        if (vector.y > 0) {
            return Directions.DOWN;
        } else if (vector.y < 0) {
            return Directions.UP;
        }
    }
    return 0;
}
