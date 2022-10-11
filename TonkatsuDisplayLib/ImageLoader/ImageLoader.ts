/**
 * 画像をロードして HTMLImageElement をラップしたオブジェクト(ImageFile)に入れるオブジェクトを作る
 */

import {ImageFile} from "./ImageFile";

export type ImageLoader = {
    load: (
        onCompleteListener: (imageList: ImageFile[]) => void,
        onErrorListener: () => void
    ) => void;
}

export const createImageLoader: (pathList: { id: string, path: string }[]) => ImageLoader
    = (targetList: { id: string, path: string }[]) => {
    return {
        load: (onCompleteListener, onErrorListener) => {
            const imageList: ImageFile[] = [];
            let n: number = 0;
            targetList.forEach(target => {
                const image = new Image();
                image.onload = () => {
                    console.log("load");
                    console.log(image);
                    n++;
                    imageList.push({
                        element: image,
                        id: target.id,
                        path: target.path
                    });
                    if (n === targetList.length) {
                        onCompleteListener(imageList);
                    }
                };
                image.onerror = ()=>{
                    onErrorListener();
                }
                image.src = getUrlFromPath(target.path);
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