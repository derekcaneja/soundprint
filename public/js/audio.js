//DRUMS DEF
var BD,SD,HH1,HH2,CYM,drum;

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
var scales = [[C, D, E, G, A, C + 12, D + 12, E + 12],
              [D, E, G, A, B, D + 12, E + 12, G + 12],
              [A, B, D, E, FS, A + 12, B + 12, D + 12 ],
              [CS, E, FS, A, B, CS + 12, E + 12, FS + 12]];
			  
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
	
	this.main = T(this.type, { mul: this.mul, poly: this.poly }).play();
	this.env = T("adsr", { d: this.noteLength, s: 0, r: 600 });
	this.clone = null

	this.main.def = function(opts) {
		scope.clone = scope.env.clone()
		
		if(scope.fx == 1){
			var op1 = T("sin", { freq: opts.freq * 3, fb: 0.25, mul: 0.4})
			var op2 = T(scope.sinType, { freq: opts.freq, phase: op1, mul: opts.velocity/128 });

			scope.clone.append(op2);
		}else if(scope.fx == 2){
		
			var op2 = T(scope.sinType, { freq: opts.freq, mul: opts.velocity/128 });

			scope.clone.append(op2);
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
				if(this.main)this.main.noteOn(scale[ii] + 60, 80);
			}
		}
	}	
}

//SET UP INSTRUMENTS
var ins1 = new SPI({ 
  hr: 1,
  type:'SynthDef',
  poly:3,
  noteLength:400,
  sinType:'sin',
  mul:0.5,
  fx:1
 });

var ins2 = new SPI({ 
  hr: 2,
  type:'PluckGen',
  poly:1,
  noteLength:300,
  mul:1,
  fx:2
 });
 
var instruments = [ins1,ins2  ,null,null]

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

	if(i % (measure*2) == 0){
		scale = scales[onScale]
		onScale += 1;
		if(onScale>=scales.length)onScale = 0;
	}
}


//SET UP
timbre.setup({ samplerate: timbre.samplerate * 0.5 });

T("audio").load("/js/libs/timbre/misc/audio/drumkit.wav", function() {
	BD  = this.slice(   0,  500).set({bang:false, mul:1});
	SD  = this.slice( 500, 1000).set({bang:false});
	HH1 = this.slice(1000, 1500).set({bang:false, mul:0.2});
	HH2 = this.slice(1500, 2000).set({bang:false, mul:0.2});
	CYM = this.slice(2000).set({bang:false, mul:0.2});

	drum = T("lowshelf", { freq: 110, gain: 8, mul: 1}, BD, SD, HH1, HH2, CYM).play();
	T("interval", {interval:"BPM64 L16"}, hitNote).start();
})
