export type LoopTimer = {
    callback: ()=>void,
    loopCount: number,
    id?: string
}