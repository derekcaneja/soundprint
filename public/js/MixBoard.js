var MixBoard = function(options) {

	// Check for options and give blank JSON if none
	options = (options) ? options : {};

	// Defaults
	this.input 	  = (options.input)	   ? options.input	  : null;
	this.output   = (options.output)   ? options.output	  : null;
	this.effects  = (options.effects)  ? options.effects  : [];

	// Master Settings
	this.masterVolume = 100;
	this.masterFade = 

	this.draw();
};

MixBoard.prototype.addEffect = function(type, options) {
	var input = this.input;
	this.input = T(type, options, input);
}

MixBoard.prototype.setMasterVolume = function(volume) {
	this.masterVolume = volume;
}

MixBoard.prototype.play = function() {
	for(var i = 0; i < this.effects.length; i++) this.input.env = this.effects[i];

	this.input.noteOn(60, 80);
}

MixBoard.prototype.draw = function() {
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');

	canvas.id = 'mix-board';
	canvas.width = 800;
	canvas.height = 400;

	context.fillStyle = this.color;
	context.fillRect(0, 0, canvas.width, canvas.height);

	$('body').append(canvas);
}