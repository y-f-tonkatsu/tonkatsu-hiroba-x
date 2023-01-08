import {DisplayObject} from "../../../TonkatsuDisplayLib/Display/DisplayObject";
import {CanvasLayer} from "../../../TonkatsuDisplayLib/Display/CanvasLayer";
import {Point} from "../../../TonkatsuDisplayLib/Display/Point";
import generate from "@babel/generator";

export class Mo01Snow extends DisplayObject {

    private _snows: Snow[] = [];
    private _time: number = 0;
    private _ground = 0;
    private _zMax = 10;

    constructor(layer: CanvasLayer) {
        super(layer);
        this._ground = layer.height;
    }

    generate() {
        const x = Math.floor(Math.random() * (this.layer.width + 200) - 100);
        const snow = new Snow(new Point(x, -10), Math.floor(Math.random() * this._zMax));
        this._snows.push(snow);
    }

    override update() {
        super.update();
        if (Math.random() > 0.8) {
            this.generate();
        }
        this._snows.forEach(snow => {
            if (!snow.isLive) return;
            if (snow.position.y > this._ground - this._time - snow.z + Math.floor(Math.random() * 10) - 5) {
                snow.isLive = false;
                return
            }
            snow.update()
        });
        this._time += 0.001;
    }

    override draw() {
        super.draw();
        const ctx = this.layer.context;
        const [w, h] = [this.layer.width, this.layer.height];

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = "#fff";
        this._snows.forEach(snow => {
            ctx.beginPath();
            const size = 2 + (10 - snow.z) * 0.2;
            ctx.ellipse(snow.position.x, snow.position.y, size, size, 0, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        });
    }
}

class Snow {
    get isLive(): boolean {
        return this._isLive;
    }

    set isLive(value: boolean) {
        this._isLive = value;
    }

    get z(): number {
        return this._z;
    }

    set z(value: number) {
        this._z = value;
    }

    get position(): Point {
        return this._position;
    }

    set position(value: Point) {
        this._position = value;
    }

    private _position: Point;
    private _z: number;
    private _speed: number = 1;
    private _vx: number = 0;
    private _t: number = 0;
    private _isLive = true;

    constructor(position: Point, z: number) {
        this._position = position;
        this._z = z;
        this._speed = 1 + (10 - this._z) * 0.5;
        this._vx = (Math.random() - 0.5) * this._z * 0.1;
        this._t = (Math.floor(Math.random() * 200) - 100) * 0.01;
    }

    update() {
        this._t += 0.1;
        this._position.add(new Point(this._vx + (Math.sin(this._t) - 0.5), this._speed));
    }
}
