/**
 * ゲームループで特定カウント後に実行する処理を表す
 */
export type LoopTimer = {
    callback: ()=>void,
    loopCount: number,
    id?: string
}