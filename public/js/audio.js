var C 	   	= 0;
var C_SHARP = 1;
var D 	   	= 2;
var D_SHARP = 3;
var E 	   	= 4;
var F 		= 5;
var F_SHARP	= 6;
var G 		= 7;
var G_SHARP	= 8;
var A 	   	= 9;
var A_SHARP = 10;
var B 	   	= 11;

var C_Major_PentonicScale = [C, D, E, G, A]
var G_Major_PentonicScale = [G, A, B, D + 12, E + 12];
var D_Major_PentonicScale = [D, E, F_SHARP, A, B];
var A_Major_PentonicScale = [A, B, C_SHARP + 12, E + 12, F_SHARP + 12];

var synthMatrix = function(scale, width, height){
	this.matrix = new Array();

	for(var n = 0; n < height; n++) {
		var count = 0;
		var temp = new Array();

		for(var i = 0; i < width; i++) {
			if(i != 0 && i % 5 == 0) count += 12;
			temp.push(scale[i % 5] + count);
		}

		this.matrix.push(temp);
	}
};

var synthMatrixFinal = new synthMatrix(C_Major_PentonicScale, 16, 16);

var bassSynth = T('SynthDef').play();
bassSynth.def = function(opts) {
	var osc1 = T('sin', { freq: 64, mul: 0.15 });
	var osc2 = T('sin', { freq: 130, mul: 0.15 });
	var env = T('linen', { s: 25, r: 250, v: 0.9 }, osc1, osc2);
	return env.on('ended', opts.doneAction).bang();
};

var rhythmSynth = T('PluckGen').play();
// rhythmSynth.def = function(opts) {
// 	var osc1 = T('sin', { freq: 262, mul: 0.10 });
// 	var osc2 = T('pulse', { freq: [262, 294, 330, 356], mul: 0.10 });
// 	var env = T('linen', { s: 50, r: 100, v: 0.9 }, osc1, osc2);
// 	return env.on('ended', opts.doneAction).bang();
// };

var harmonySynth = T('SynthDef').play();
harmonySynth.def = function(opts) {
	var osc1 = T('saw', { freq: [262, 294, 330, 356, 384], mul: 0.10 });
	var osc2 = T('sin', { mul: 0.10 });
	var env = T('linen', { s: 150, r: 250, v: 0.9 }, osc1, osc2);
	return env.on('ended', opts.doneAction).bang();
};

var melodySynth = T('OscGen').play();
// melodySynth.def = function(opts) {
// 	var osc1 = T('pulse', { freq: [262, 294, 330, 356, 384, 412], mul: 0.05 });
// 	var env = T('linen', { s: 100, r: 250, v: 0.9 }, osc1);
// 	return env.on('ended', opts.doneAction).bang();
// };