const path = require('path');
const process = require("process");

const Util = {
    'getImage': (works, id) => {
        return works.find((currentWork) => {
            return currentWork.id.toString() === id.toString();
        });
    },
    'getImagePath': (work) => {
        return path.join('works', work.category, work.path);
    },
    'getImagePathFromOuter': (work) => {
        return path.join(process.cwd(), '/public', Util.getImagePath(work));
    },
    'getThumbPath': (work) => {
        const imagePath = Util.getImagePath(work);
        let dir = path.dirname(imagePath);
        let ext = path.extname(imagePath);
        let name = path.basename(imagePath, ext);
        return path.join(dir, name + '-thumb' + ext);
    },
    'getThumbPathFromOuter': (work) => {
        return path.join(process.cwd(), '/public', Util.getThumbPath(work));
    },
    'getPosixThumbPath': (work) => {
        return path.join('/public', Util.getThumbPath(work))
            .replace(/\\/g, '/')
            .replace('public/', '')
    },
    'getPosixImagePath': (work) => {
        return path.join('/public', Util.getImagePath(work))
            .replace(/\\/g, '/')
            .replace('public/', '');
    }
}


module.exports = Util;