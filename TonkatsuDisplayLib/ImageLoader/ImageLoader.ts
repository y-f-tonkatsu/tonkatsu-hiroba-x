import {AppData} from "../../Resource/AppData";

export type ImageLoader = {
    load: (
        onCompleteListener: (imageList: HTMLImageElement[]) => void,
        onErrorListener: () => void
    ) => void;
}

export const createImageLoader: (pathList: string[]) => ImageLoader
    = (pathList: string[]) => {
    return {
        load: (onCompleteListener, onErrorListener) => {
            const imageList: HTMLImageElement[] = [];
            let n: number = 0;
            pathList.forEach(path => {
                const image = new Image();
                image.onload = (ev: Event) => {
                    console.log("load");
                    console.log(image);
                    n++;
                    imageList.push(image);
                    if (n === pathList.length) {
                        onCompleteListener(imageList);
                    }
                }
                image.src = getUrlFromPath(path);
            })
        }
    };
}

/**
 * public/images/ 以下のパスを url に変換して返す
 * @param path public/images/ 以下のパスから url を返す
 */
const getUrlFromPath = (path: string) => {
    return `../../images/${path}`;
}