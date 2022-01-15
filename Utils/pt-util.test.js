const Util = require('./pt-util');
const works = [
    {
        "id": 4,
        "title": "六本木の夜景",
        "description": "「神様はお亡くなりになった。」とマハル師はかたったが、実際は、現実的に考えればまず死んでいると見て間違いない状況であったというだけで、はっきりと死んだと分かる描写はなく、続編制作決定となれば実は生きていたことにできる余地は残っているのである。",
        "path": "/absphoto/002_roppongi.jpg",
        "lastBuildDate": "Wed, 11 Apr 2018 21:40:00 +0900"
    },
    {
        "id": 3,
        "title": "丸の内の夜景2",
        "description": "生ゆば君がニンジンを凝視して「あー、参考にならん、このモデル全然参考にならんわー。所詮ニンジンだしなー。」とかいいながら、トヨタのSUVのデッサンをしてて、ニンジンにしたら「俺に何を期待してるんだ..」って感じだろーなーと思った。",
        "path": "/absphoto/001_maru2.jpg",
        "lastBuildDate": "Wed, 11 Apr 2018 21:40:00 +0900"
    },
    {
        "id": 2,
        "title": "丸の内の夜景",
        "description": "「子は怪力乱神を語らず」と言われた孔子は、残業は敬しつつもこれを遠ざけるのが知恵であると語っている。「敬遠」の語源であり、また、孔子の合理主義者としての一面を示すエピソードである。",
        "path": "/absphoto/000_maru.jpg",
        "lastBuildDate": "Wed, 11 Apr 2018 21:40:00 +0900"
    },
    {
        "id": 1,
        "title": "歌舞伎町と果物",
        "description": "「私は天皇陛下の人格を非常にそんけいしている。」とマハル師はかたった。「なので、私は自分が天皇ではなくてほんとうによかったとおもっている。」ともかたった。生ゆば君は立派な人格など持たされては負けなのかもしれないと思った。",
        "path": "/absphoto/010_abs004.jpg",
        "lastBuildDate": "Wed, 11 Apr 2018 21:40:00 +0900"
    }
];

const work = works[works.length - 1];


test('Object exists', () => {
    expect(typeof Util).toBe('object');
    expect(typeof Util.getThumbPath).toBe('function');
});

test('getImage', () => {
    expect(Util.getImage(works, 3)).toBe(works[1]);
    expect(Util.getImage(works, '3')).toBe(works[1]);
});

test('getImagePath', () => {
    expect(Util.getImagePath(work)).toBe('works\\absphoto\\010_abs004.jpg');
});

test('getImagePathFromOuter', () => {
    expect(Util.getImagePathFromOuter(work)).toBe('public\\works\\absphoto\\010_abs004.jpg');
});

test('getThumbPath', () => {
    expect(Util.getThumbPath(work)).toBe('works\\absphoto\\010_abs004-thumb.jpg');
});

test('getThumbPathFromOuter', () => {
    expect(Util.getThumbPathFromOuter(work)).toBe('public\\works\\absphoto\\010_abs004-thumb.jpg');
});

test('getPosixThumbPath', () => {
    expect(Util.getPosixThumbPath(work)).toBe('absphoto/010_abs004-thumb.jpg');
});