import {Point} from "./Point";

export class Transform {
    position: Point = new Point();
    scale: Point = new Point(1, 1);
    rotation: number = 0;

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

    zero() {
        this.position = new Point();
        this.scale = new Point(1, 1);
        this.rotation = 0;
    }

    setPosition(x: number, y: number) {
        this.position.set(x, y);
    }

    move(x: number, y: number) {
        this.position.add(new Point(x, y));
    }

    setScale(x: number, y: number) {
        this.scale.set(x, y);
    }

    substitute(transform: Transform) {
        this.position.substitute(transform.position);
        this.scale.substitute(transform.scale);
        this.rotation = transform.rotation;
    }

    add(transform: Transform) {
        this.position.add(transform.position);
        this.scale.multiply(transform.scale);
        this.rotation += transform.rotation;
    }

}
