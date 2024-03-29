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

export const createImageLoader: (pathList: { id: string, path: string }[], root: string) => ImageLoader
    = (targetList: { id: string, path: string }[], root = "") => {
    return {
        load: (onCompleteListener, onErrorListener) => {
            const imageList: ImageFile[] = [];
            let n: number = 0;
            targetList.forEach(target => {
                const image = new Image();
                image.onload = () => {
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
                image.onerror = () => {
                    onErrorListener();
                }
                if(root === ""){
                    image.src = getUrlFromPath(target.path);
                } else {
                    image.src = `${root}${target.path}`;
                }
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