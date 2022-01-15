const fs = require('fs');
const sizeOf = require('image-size');
const works = require('./public/works/works.json');
const Util = require('./Utils/pt-util');

const addedWorks = works.map(function (work) {
    let imagePath = Util.getImagePathFromOuter(work);
    const dimen = sizeOf(imagePath);
    work.width = dimen.width;
    work.height = dimen.height;

    const thumbPath = Util.getThumbPathFromOuter(work);

    const thumbDimen = sizeOf(thumbPath);
    work.thumbWidth = thumbDimen.width;
    work.thumbHeight = thumbDimen.height;

    work.thumb = Util.getPosixThumbPath(work);
    work.path = Util.getPosixImagePath(work);

    return work;
});


fs.writeFile('./public/works/works-size-added.json', JSON.stringify(addedWorks), 'utf8', function (err) {
    if (err) {
        console.log(err);
    }
});

