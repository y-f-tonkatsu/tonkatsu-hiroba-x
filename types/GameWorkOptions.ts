export type GameWorkOptions = {
    frameRate: number,
    canvasLayers: {
        name: string,
        zIndex: number,
    }[],
    imageList?: {
        id: string,
        path: string
    }[],
    imageRoot?: string
};