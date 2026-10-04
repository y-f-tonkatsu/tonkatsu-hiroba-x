import {Effect} from "./Effect";
import {EffectComponent} from "./EffectComponent";
import {Point} from "../../../TonkatsuDisplayLib/Display/Point";
import {Size} from "../../../TonkatsuDisplayLib/Display/Size";
import {Transform} from "../../../TonkatsuDisplayLib/Display/Transform";

export class FlashEffect extends Effect {

    private _color: string;
    private _score: number;
    private readonly _image: HTMLImageElement;
    private _transform: Transform;
    private _size: Size;

    constructor(parent: EffectComponent, options: {
        color: string, image: HTMLImageElement, score: number, transform: Transform, size: Size, onEndListener: () => void
    }) {
        super(parent, options.onEndListener);
        parent.addEffect(this);
        this._color = options.color;
        this._score = options.score;
        this._image = options.image;
        this._transform = options.transform;
        this._size = options.size;
        this.length = 36
    }

    override update() {
        this._transform.rotation++;
        this._transform.scale.add(new Point(0.1, 0.1))
    }

    override draw() {
        const ctx = this._ctx;
        ctx.save();
        const [x, w, y, h] = [this._transform.position.x, this._size.width * this._transform.scale.x,
            this._transform.position.y, this._size.height * this._transform.scale.y];
        const [cx, cy] = [x + this._size.width * 0.5, y + this._size.height * 0.5];
        ctx.translate(cx, cy);
        ctx.rotate(this._transform.rotation);
        ctx.globalAlpha = 1 - this._progress / this.length;
        ctx.drawImage(this._image, -w * 0.5, -h * 0.5, w, h);
        ctx.rotate(-this._transform.rotation);
        ctx.globalAlpha = 1;
        if (this._progress > 4) {
            ctx.font = "100px corporate-logo-ver2";
            ctx.textAlign = "center";
            ctx.fillStyle = "#0077ff";
            ctx.fillText(`+${this._score.toString()}`, 0, -this._progress * 3)
        }
        ctx.restore();
    }

}