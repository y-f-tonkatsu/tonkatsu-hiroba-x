export type GameWorkOptions = {
    canvasLayers: {
        "name": string,
        "zIndex": number,
    }[],
    imageList?: {
        name: string,
        path: string
    }[]
};