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
var scalesPerMeasure = 1;
var scales = [];
var numScales = 4;
var toScales = [	[C, D, E, G, A, C + 12, D + 12, E + 12],
					[D, E, G, A, B, D + 12, E + 12, G + 12],
					[A, B, D, E, FS, A + 12, B + 12, D + 12 ],
					//[C, D, E, G, A, C + 12, D + 12, E + 12]]
					[CS, E, FS, A, B, CS + 12, E + 12, FS + 12]];
					
var lastScale = 0;
var newScale
for(var ii = 0; ii < numScales; ii+=1){
	//while(newScale==null||newScale==lastScale)newScale = Math.floor(Math.random()*toScales.length)
	scales.push(toScales[ii]);
	//lastScale = newScale;
}

var scale = scales[0];

var measure = 32;
var half = measure/2;
var quarter = measure/4;
var eigth = measure/8
var sxth = measure/16;

//SOUND PRINT INSTRUMENT
function SPI(options){
	var scope = this;
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
	
	this.main = T(this.type, { mul: this.mul, poly: this.poly }).play();
	this.env = T("adsr", { d: this.noteLength, s: 0, r: 0 });
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
	if(beat % this.hitRate == 0) {
		//(this.matrix||[0,0,0,0,0,0,0,0])[Math.floor(beat / this.beatRate)%8].length
		for(var ii = 0; ii < 8; ii++) {
			//if(this.matrix[Math.floor(beat / this.hitRate)%8][ii] == 1){
			if(Math.random()<0.3){
				if(this.main)this.main.noteOn(scale[ii] + (this.oct*12), 80, 10);
			}
		}
	}	
}

//SET UP INSTRUMENTS
var bass1 = { 
    hr          : 2,
    type        : 'SynthDef',
    poly        : 1,
    noteLength  : 1000,
    mul         : 1,
    fx          : 1,
    oct         : 1
}

var bass2 = { 
    hr          : 4,
    type        : 'SynthDef',
    poly        : 1,
    noteLength  : 500,
    mul         : 1,
    fx          : 2,
    oct         : 1
}

var bass3 = { 
    hr          : 8,
    type        : 'SynthDef',
    poly        : 1,
    noteLength  : 3000,
    mul         : 1,
    fx          : 2,
    oct         : 1
}

var melody1 = { 
    hr: 1,
    type:'SynthDef',
    poly:1,
    noteLength:10,
    sinType:'saw',
    mul:0.5,
    fx:1,
    oct:6
}

var melody2 = { 
    hr: 4,
    type:'SynthDef',
    poly:3,
    noteLength:1000,
    mul:0.05    ,
    fx:1,
    oct:6
}

var melody3 = { 
    hr: 16,
    type:'OscGen',
    poly:6,
    noteLength:10000,
    mul:0.03    ,
    fx:1,
    oct:6
}


var rhythm1 = { 
    hr: 2,
    type:'PluckGen',
    poly:3,
    noteLength:200,
    sinType:'saw',
    dist:true,
    mul:0.1,
    fx:2,
    oct:4
}

var rhythm2 = { 
    hr: 2,
    type:'PluckGen',
    poly:3,
    noteLength:1000,
    sinType:'sin',  
    mul:0.1,
    fx:2,
    oct:3
}

var rhythm3 = { 
    hr: 4,
    type:'PluckGen',
    poly:2,
    noteLength:1000,
    sinType:'sin',  
    mul:0.5,
    fx:2,
    oct:4
}

var harmony1 = { 
    hr: 2,
    type:'PluckGen',
    poly:1,
    noteLength:600,
    mul:0.15,
    fx:2,
    oct:5
}

var harmony2 = { 
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
    hr: 1,
    type:'PluckGen',
    poly:1,
    noteLength:200,
    dist:true,
    mul:0.1,
    fx:2,
    oct:5
}

var ins1 = new SPI([melody1, melody2, melody3][Math.floor(Math.random()* 3)]);

var ins2 = new SPI([bass1, bass2, bass3][Math.floor(Math.random()* 3)]);

var ins3 = new SPI([rhythm1, rhythm2, rhythm3][Math.floor(Math.random()* 3)]);

var ins4 = new SPI([harmony1, harmony2, harmony3][Math.floor(Math.random()* 3)]);

var instruments = [ins1,ins2, ins3, ins4]

//ON HIT
function hitNote(count){
	var i = count % measure;

	HH1.bang();
	if(i % eigth == 0 && i > 0) HH2.bang();
	if(i % eigth == 0 || i > measure-eigth) SD.bang();
	if(	i % quarter == 0 
		|| (i > half && i % quarter == 0) 
		|| (i > (measure-quarter) && i % sxth == 0) 
		|| ( i > (measure-eigth))
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
timbre.setup({ samplerate: timbre.samplerate});

T("audio").load("/js/libs/timbre/misc/audio/drumkit.wav", function() {
	BD  = this.slice(   0,  500).set({bang:false, mul:1});
	SD  = this.slice( 500, 1000).set({bang:false});
	HH1 = this.slice(1000, 1500).set({bang:false, mul:0.2});
	HH2 = this.slice(1500, 2000).set({bang:false, mul:0.2});
	CYM = this.slice(2000).set({bang:false, mul:0.2});

    drum = T("lowshelf", { freq: 110, gain: 8, mul: 0.3}, BD, SD, HH1, HH2, CYM).play();
    // drumFill = function() {
    //     BD.bang();
    //     SD.bang();
    //     HH1.bang();
    //     HH2.bang();
    //     CYM.bang();
    // }

	T("interval", {interval:"BPM64 L16"}, hitNote).start();
})
