//DRUMS DEF
var BD, SD, HH1, HH2, CYM, drum, drumFill;

//SCALES
var C  = 0;
var CS = 1;
var D  = 2;
var DS = 3;
var E  = 4;
var F  = 5;
var FS = 6;
var G  = 7;
var GS = 8;
var A  = 9;
var AS = 10;
var B  = 11;

var onScale = 0;
var scalesPerMeasure = 0.5;
var scales = [];
var numScales = 4;
var toScales = [	[C, D, E, G, A, C + 12, D + 12, E + 12],
					[D, E, G, A, B, D + 12, E + 12, G + 12],
					[A, B, D, E, FS, A + 12, B + 12, D + 12 ],
					[CS, E, FS, A, B, CS + 12, E + 12, FS + 12]]
//var mainScale = Math.round(Math.random()*5)
					
var lastScale = 0;
var newScale = 0;
for(var ii = 0; ii < numScales; ii+=1){;
	newScale = Math.floor(Math.random()*numScales)
	while(newScale==null|| toScales[newScale]==null || Math.random()<0.9){
		newScale = Math.floor(Math.random()*numScales);
	}
	console.log(newScale);
	scales.push(toScales[newScale]);
	toScales[newScale] = null
}

var scale = scales[0];

var measure = 32;
var half = measure/2;
var quarter = measure/4;
var eigth = measure/8
var sxth = measure/16;

//SOUND PRINT INSTRUMENT
function SPI(g, o, options){
	this.grid = g
	this.grid.ins = this;
	this.matrix = options.mat||null;
	this.hitRate = options.hr || 4;
	this.beatRate = options.br || 4;
	this.type = options.type||'SynthDef';
	this.fx = options.fx||'SynthDef';
	this.mul = options.mul||0.45;
	this.main = null;
	this.poly = options.poly||3;
	this.noteLength = options.noteLength||300;
	this.sinType = options.sinType||'sin';
	this.oct = options.oct||3;
	this.dist = options.dist;
	this.hitsPerChange = options.hits||1;
	this.defOct = o;
	this.grid.pitch.setValue(this.defOct);
    this.distort = 0;
	
	this.rebuild();
	
	this.grid.setNotes(this.hitRate);
}


SPI.prototype.rebuild = function(){
	var scope = this;
	this.main = T(this.type, { mul: this.mul, poly: this.poly }).play();
	this.env = T("adsr", { d: this.noteLength, s: 0 + this.distort / 10, r: 0 });
	this.clone = null

	this.main.def = function(opts) {
		scope.clone = scope.env.clone()
		
		if(scope.fx == 1){
			var op1 = T("sin", { freq: opts.freq * 1, fb: 0.25, mul: 0.4})
			var op2 = T(scope.sinType, { freq: opts.freq, phase: op1, mul: opts.velocity/128 });
			if(scope.dist){
				//op2 = T("dist", {pre:40, post:-10, cutoff:5}, op2)
				op2 = T("comp", {thresh:-90, knee:100, ratio:30, gain:40}, op2)
			}

			scope.clone.append(op2);
		}else if(scope.fx == 2){
		
			var op1 = T(scope.sinType, { freq: opts.freq, mul: opts.velocity/128 });
			if(scope.dist)op1 = T("dist", {pre:60, post:-2, cutoff:1000}, op1)

			scope.clone.append(op1);
		}
		
		return scope.clone.on("ended", opts.doneAction).bang();
	}
}
SPI.prototype.playNote = function(beat){
	if(!this.grid || !this.grid.densityArray)return false;
	if(beat % this.hitRate == 0) {
		var beatIndex = Math.floor(beat / this.hitRate);
		this.notes = [];
		for(var ii = 0; ii < this.grid.densityArray[beatIndex].length; ii++) {
			if(this.grid.densityArray[beatIndex][ii] > 0.3 + ((this.hitRate) * 0.1)){
				this.notes.push([scale[ii] + (this.defOct*12), 80, beatIndex, ])
				this.grid.notes.push({x: ii, y: beatIndex, a: 1});
				if(this.main)this.main.noteOn( scale[ii] + (this.defOct*12), 80);
			}
		}
	}else if((beat*this.hitsPerChange) % (this.hitRate) == 0 && this.notes){
		for(var ii = 0; ii < this.notes.length; ii += 1){
			if(this.main)this.main.noteOn( this.notes[ii][0],this.notes[ii][1]);
		}
	}
}
		

//SET UP INSTRUMENTS
var bass1 = { 
	name 		: 'bass 1',
    hr          : 4,
    type        : 'SynthDef',
    poly        : 1,
    noteLength  : 1000,
    mul         : 1,
    fx          : 1,
}

var bass2 = { 
	name 		: 'bass 2',
    hr          : 2,
    type        : 'SynthDef',
    poly        : 1,
    noteLength  : 500,
    mul         : 1,
    fx          : 2,
}

var bass3 = { 
	name 		: 'bass 3',
    hr          : 8,
    type        : 'SynthDef',
    poly        : 1,
    noteLength  : 1000,
    mul         : 1,
    fx          : 2,
}

var melody1 = { 
	name : 'melody 1',
    hr: 4,
    type:'SynthDef',
    poly:1,
    noteLength:10,
    sinType:'saw',
    mul:0.5,
    fx:1,
}

var melody2 = { 
	name : 'melody 2',
    hr: 8,
	hits: 4 ,
    type:'SynthDef',
    poly:3,
    noteLength:1000,
    mul:0.05    ,
    fx:1,
}

var melody3 = { 
	name : 'melody 3',
    hr: 2,
    type:'OscGen',
    poly:6,
    noteLength:1000,
    mul:0.03    ,
    fx:1,
}


var rhythm1 = { 
	name : 'rhythm 1',
    hr: 2,
    type:'PluckGen',
    poly:3,
    noteLength:200,
    sinType:'saw',
    mul:0.6,
    fx:2,
}

var rhythm2 = { 
	name : 'rhythm 2',
    hr: 2,
    type:'PluckGen',
    poly:3,
    noteLength:1000,
    sinType:'sin',  
    mul:0.3,
    fx:2,
    oct:3
}

var rhythm3 = { 
	name : 'rhythm 3',
    hr: 4,
    type:'PluckGen',
    poly:2,
    noteLength:1000,
    sinType:'sin',  
    mul:0.3,
    fx:2,
    oct:4
}

var harmony1 = { 
	name : 'harmony 1',
    hr: 4,
    type:'PluckGen',
    poly:1,
	hits:2,
    noteLength:600,
    mul:0.15,
    fx:2,
    oct:5
}

var harmony2 = { 
	name : 'harmony 2',
    hr: 2,
    type:'SynthDef',
    sinType:'saw',
    poly:1,
    noteLength:800,
    mul:0.05,
    fx:1,
    oct:4
}

var harmony3 = { 
	name : 'harmony 3',
    hr: 1,
    type:'PluckGen',
    poly:1,
    noteLength:200,
    dist:true,
    mul:0.1,
    fx:2,
    oct:5
}

var ins1 = new SPI(toneMatrix1, 1, [bass1, bass2, bass3][Math.floor(Math.random()* 3)]);

var ins2 = new SPI(toneMatrix2, 3, [rhythm1, rhythm2, rhythm3][Math.floor(Math.random()* 3)]);

var ins3 = new SPI(toneMatrix3, 4, [harmony1, harmony2, harmony3][Math.floor(Math.random()* 3)]);

var ins4 = new SPI(toneMatrix4, 6, [melody1, melody2, melody3][Math.floor(Math.random()* 3)]);

var instruments = [ins1,ins2, ins3, ins4]

//ON HIT
function hitNote(count){
	var i = count % measure;

	HH1.bang();
	if(i % eigth == 0 && i > 0) HH2.bang();
	if(i % eigth == 0 || i > measure-eigth) SD.bang();
	if(	i % quarter == 0 
		|| (i > (measure-quarter) && i % sxth == 0)
	) BD.bang();

	for(var ii = 0; ii < instruments.length; ii += 1){
		if(instruments[ii])instruments[ii].playNote(i);
	}

	if(i % (measure*scalesPerMeasure) == 0){
		scale = scales[onScale]
		onScale += 1;
		if(onScale>=scales.length)onScale = 0;
	}
}


//SET UP
timbre.setup({ samplerate: timbre.samplerate*0.5});

T("audio").load("/js/libs/timbre/misc/audio/drumkit.wav", function() {
	BD  = this.slice(   0,  500).set({bang:false, mul:1});
	SD  = this.slice( 500, 1000).set({bang:false});
	HH1 = this.slice(1000, 1500).set({bang:false, mul:0.2});
	HH2 = this.slice(1500, 2000).set({bang:false, mul:0.2});
	CYM = this.slice(2000).set({bang:false, mul:0.2});

    drum = T("lowshelf", { freq: 110, gain: 8, mul: 0.3}, BD, SD, HH1, HH2, CYM).play();

	T("interval", {interval:"BPM64 L16"}, hitNote).start();
})
