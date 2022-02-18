var lib = {};
(function (cjs, an) {

var p; // shortcut to reference prototypes
lib={};
var ss={};var img={};
lib.ssMetadata = [];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.ignorePause = false;
	this.gotoAndPlay = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
	}
}).prototype = p = new cjs.MovieClip();
// symbols:
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop, this.reversed));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.Face = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// レイヤー_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("AjxO1QjEgZibhXQhhg3hRhPQhQhOg5hgQguhNg3iMQgUgygJgeQgOgtgDglQgEgqAHgyQAEgjANg2QAThVASg7QAXhNAeg9QAzhnBfhtQA6hDB7h2QBchZA2gpQBWhCBTgZQAxgQBAgGQAogDBMgCQBggCAwACQBRADA+AOQBfAVBoA2QBKAnBsBJQCsB0BeBgQCDCFApCSQAcBkgGCOQgMEfh3DKQh0DFjfB+QjLBzj8AlQhtARhmAAQhSAAhOgLgAinrMQhGAIgyAbQgcAPgfAaQgUARggAgQimCmiQCsQghAngPAWQgaAigOAfQgPAegMAoQgHAYgMAxQgNA8ABAcQAAAYAIAeQAFARAMAkQAfBWARAoQAdBEAhAxQA8BZBeBBQBaA+BsAgQDAA6DzggQDggcClhbQBdgyBIhGQBMhKAuhZQAohKAZhoQAwi/griKQgmh6h1htQhNhHidhmQhCgrgjgTQg5gfgygQQg3gRhIgGQgsgDhWgBIgNAAQhKAAgoAFgAgVGyQiFgPihhAQgqgRgPgPQgNgMgGgQQgHgQAEgQQAEgTAUgNQASgLAWgBQASgBAXAFIApAMQBkAfCEACQBMABCggLQAvgEAYAHQATAGANAMQAPANADARQAFAcgYAaQgTAVghAOQhfAph0AAQgnAAgpgFgAlsiVQgWgDgSgNQgVgPgLgVQgMgXACgXQADgZASgSQAUgSAXABQABAAABAAQABAAABAAQAAAAABgBQAAAAAAgBQAVgBAUAKQAUAJAMARQANASADAVQADAWgHAUQgJAagWAMQgNAHgRAAIgLgBgAC9jEQgTgKgLgRQgKgRgCgVQgCgUAGgUQAGgVANgLQAQgQAWAAQANAAABgHQAhAHANALQALAJAGAQQATApgQAlQgIATgQANQgRANgUACIgFABQgRAAgQgJg");
	this.shape.setTransform(105.6167,95.9587);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Face, new cjs.Rectangle(0,0,211.3,191.9), null);


// stage content:
(lib.animation_ex = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// レイヤー_1
	this.instance = new lib.Face();
	this.instance.setTransform(133.9,126.3,1,1,0,0,0,105.6,96);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({x:797.9,y:432.5},6).to({x:133.9,y:126.3},7).wait(1));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(628.3,510.3,275.30000000000007,18.099999999999966);
// library properties:
lib.properties = {
	id: '21A7D28D09C3D348AD1D45802A5C7C9F',
	width: 1200,
	height: 960,
	fps: 12,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['21A7D28D09C3D348AD1D45802A5C7C9F'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}



})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;

const Face = lib.Face;
export {Face};