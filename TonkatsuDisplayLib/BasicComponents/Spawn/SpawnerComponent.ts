import {Component} from "../Component";
import {DisplayObject} from "../../Display/DisplayObject";

export class SpawnerComponent extends Component{

    private readonly _spawnFunc:()=>DisplayObject;
    private readonly _list:DisplayObject[] = [];

    constructor(parent: DisplayObject, spawnFunc: ()=>DisplayObject) {
        super(parent);
        this._spawnFunc = spawnFunc;
    }

    spawn(){
        const obj = this._spawnFunc();
        obj.update();
        this._list.push(obj);
        this.parent.add(obj);
    }

    kill(target:DisplayObject){
        this.parent.remove(target);
        target.destruct();
    }

}