var C 	   	= 0;
var C_SHARP = 0.5
var D 	   	= 1;
var D_SHARP = 1.5;
var E 	   	= 2;
var F 		= 3;
var F_SHARP	= 3.5;
var G 		= 4;
var G_SHARP	= 4.5;
var A 	   	= 5;
var A_SHARP = 5.5;
var B 	   	= 6;

var C_Major_PentonicScale = [C, D, E, G, A]
var G_Major_PentonicScale = [G, A, B, D + 7, E + 7];
var D_Major_PentonicScale = [D, E, F_SHARP, A, B];
var A_Major_PentonicScale = [A, B, C_SHARP + 7, E + 7, F_SHARP + 7];

var BPM = 120;

var synthMatrix = function(instrument, scale, width, height){
	this.instrument = T(instrument).play();
	this.scale 		= scale;
	this.width 		= width;
	this.height 	= height;
	this.matrix 	= new Array();
	this.waveform   = this.instrument.cells[1];
	console.log(this.instrument.cells);
	var count = 0;

	for(var n = 0; n < this.height; n++) {
		var temp = new Array();

		if(n != 0 && n % 5 == 0) count += 7;

		for(var i = 0; i < this.width; i++) {
			temp.push(scale[n % 5] + count);
		}

		this.matrix.push(temp);
	}
};

var C_SynthMatrix = new synthMatrix('OscGen', C_Major_PentonicScale, 16, 16);
var G_SynthMatrix = new synthMatrix('PluckGen', G_Major_PentonicScale, 16, 16);
var D_SynthMatrix = new synthMatrix('OscGen', D_Major_PentonicScale, 16, 16);
var A_SynthMatrix = new synthMatrix('PluckGen', A_Major_PentonicScale, 16, 16);



var metronome = T('interval', { interval: 'BPM' + BPM + ' L16' }, function(count) {
	C_SynthMatrix.instrument.noteOn(C_SynthMatrix.matrix[count % 16][0] + 53, 80);
	G_SynthMatrix.instrument.noteOn(G_SynthMatrix.matrix[count % 16][0] + 53, 80);
	D_SynthMatrix.instrument.noteOn(D_SynthMatrix.matrix[count % 16][0] + 53, 80);
	A_SynthMatrix.instrument.noteOn(A_SynthMatrix.matrix[count % 16][0] + 53, 80);
});

//metronome.start();
// var waveformView = new WaveViewer(this.waveform, 200, document.getElementById('BassWaveform'), 311, 80);
// waveformView.start();
// var fft = T("scope", {size:'.04', interval:5000}).on("data", function() {
//   fft.plot({target:document.getElementById('BassWaveform')});
// }).listen(metronome);