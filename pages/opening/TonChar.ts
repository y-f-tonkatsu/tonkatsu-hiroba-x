import {DisplayObject} from "../../TonkatsuDisplayLib/Display/DisplayObject";
import {SpriteComponent} from "../../TonkatsuDisplayLib/BasicComponents/Sprite/SpriteComponent";
import {CoordinationComponent} from "../../TonkatsuDisplayLib/BasicComponents/Coordination/CoordinationComponent";
import {MoverComponent} from "./MoverComponent";

export type TonCharOptions = {
    charID: number;
    sprite: SpriteComponent;
    coordination: CoordinationComponent;
    mover: MoverComponent;
}

export class TonChar extends DisplayObject {
    private _charID: number;
    private readonly _sprite: SpriteComponent;
    private readonly _coordination: CoordinationComponent;
    private readonly _mover: MoverComponent;

    get charID(): number {
        return this._charID;
    }
    set charID(value: number) {
        this._charID = value;
    }

    constructor(options: TonCharOptions) {
        super();
        this._charID = options.charID;
        this._sprite = options.sprite;
        this._coordination = options.coordination;
        this._mover = options.mover;
        this.attachComponent(this._coordination, this._mover, this._sprite);
    }
}