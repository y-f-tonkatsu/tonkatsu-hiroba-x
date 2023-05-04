import {Point} from "./Point";

/**
 * DisplayObject の2D位置、サイズ、回転を表す。
 */
export class Transform {
    position: Point = new Point();
    scale: Point = new Point(1, 1);
    rotation: number = 0;

    /**
     * 複数の Transform を合成した新しい Transform を作って返す。
     * @param targets 合成対象の Transform の配列
     */
    static combine(targets: Transform[]) {
        return targets.reduce((previousValue, currentValue) => {
            previousValue.position.add(currentValue.position);
            previousValue.scale.multiply(currentValue.scale);
            previousValue.rotation += currentValue.rotation;
            return previousValue;
        })
    }

    constructor() {
    }

    /**
     * 初期値に戻す。
     * 位置: (0, 0)
     * サイズ: (1, 1)
     * 回転: 0
     */
    zero() {
        this.position = new Point();
        this.scale = new Point(1, 1);
        this.rotation = 0;
    }

    /**
     * 位置を設定
     */
    setPosition(x: number, y: number) {
        this.position.set(x, y);
    }

    /**
     * 位置を指定値だけ移動
     */
    move(x: number, y: number) {
        this.position.add(new Point(x, y));
    }

    /**
     * サイズを指定
     */
    setScale(x: number, y: number) {
        this.scale.set(x, y);
    }

    /**
     * 対象の Transform と同じ値に設定。
     * @param transform 対象の Transform
     */
    substitute(transform: Transform) {
        this.position.substitute(transform.position);
        this.scale.substitute(transform.scale);
        this.rotation = transform.rotation;
    }

    /**
     * 対象の Transform と合成する。
     * 位置・回転は加算、サイズは乗算。
     * @param transform 対象の Transform
     */
    add(transform: Transform) {
        this.position.add(transform.position);
        this.scale.multiply(transform.scale);
        this.rotation += transform.rotation;
    }

}
