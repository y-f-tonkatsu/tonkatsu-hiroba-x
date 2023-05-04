/**
 * 二次元の点またはベクトルを表す。
 */
export class Point {
    x: number = 0;
    y: number = 0;

    constructor(x: number = 0, y: number = 0) {
        this.set(x, y);
    }

    /** 逆ベクトルを作って返す */
    static reverse(point:Point) {
        return new Point(-point.x, -point.y);
    }

    /**
     * 2つの点を合成した新しい点を返す
     */
    static combine(a: Point, b: Point) {
        return new Point(a.x + b.x, a.y + b.y);
    }

    /**
     * ベクトルを整数倍して返す
     */
    static multiply(a: Point, b: number) {
        return new Point(a.x * b, a.y * b);
    }

    /* よく使うものを作る static メソッド */
    static zero() {
        return new Point(0, 0);
    }

    static up(){
        return new Point(0, -1);
    }

    static upRight(){
        return new Point(1, -1);
    }

    static right(){
        return new Point(1, 0);
    }

    static downRight(){
        return new Point(1, -1);
    }

    static down(){
        return new Point(0, 1);
    }

    static downLeft(){
        return new Point(-1, 1);
    }

    static left(){
        return new Point(-1, 0);
    }

    static upLeft(){
        return new Point(-1, -1);
    }

    /** 同じベクトルを作って返す */
    clone() {
        return new Point(this.x, this.y);
    }

    /** 0ベクトルにする */
    reset(){
        this.x = 0;
        this.y = 0;
    }

    /** 0ベクトルなら true */
    isZero() {
        return this.x === 0 && this.y === 0;
    }

    /**
     * x, y　の値を指定してセット
     * @param x
     * @param y
     */
    set(x: number, y: number) {
        [this.x, this.y] = [x, y];
    }

    /**
     * 別の点に置き換える
     */
    substitute(point: Point) {
        [this.x, this.y] = [point.x, point.y];
    }

    /* 四則演算 */

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

    /**
     * 指定したベクトルと同一ベクトルなら true
     * @param target
     */
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
