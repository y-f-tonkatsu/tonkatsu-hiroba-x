import {Transform} from "../Transform";

export type Animation = {
    id: string,
    update: (delta:number) => void,
    onCompleteListener: ()=>void,
    totalFrames: number,
    transform: Transform
}

export const popupAnimation: Animation = {
    id: "popup",
    update: (delta) => {
        popupAnimation.transform.position.y = delta
    },
    onCompleteListener: ()=>{

    },
    transform: new Transform(),
    totalFrames: 100
}
