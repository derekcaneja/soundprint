var ToneMatrix = function(options) {

	// Check for options and give blank JSON if none
	options = (options) ? options : {};

	//console.log(options.width);

	// Defaults
	this.matrix 	= (options.matrix) 	   ? options.matrix     : [[00, 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11],[11, 00, 01, 02, 03, 04, 05, 06, 07, 08, 09, 10],[10, 11, 00, 03, 02, 03, 04, 05, 06, 07, 08, 09],[09, 10, 11, 00, 01, 02, 03, 04, 05, 06, 07, 08],[08, 09, 10, 11, 00, 01, 02, 03, 04, 05, 06, 07],[07, 08, 09, 10, 11, 00, 01, 02, 03, 04, 05, 06],[06, 07, 08, 09, 10, 11, 00, 01, 02, 03, 04, 05],[05, 06, 07, 08, 09, 10, 11, 00, 01, 02, 03, 04],[04, 05, 06, 07, 08, 09, 10, 11, 00, 01, 02, 03],[03, 04, 05, 06, 07, 08, 09, 10, 11, 00, 01, 02],[02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 00, 01],[01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 00]];
	this.BPM   		= (options.BPM)    	   ? options.BPM 	    : 0;
	this.color 		= (options.color)  	   ? options.color  	: 'rgba(0, 0, 0, 1)';
	this.instrument = (options.instrument) ? options.instrument : null;
	this.width 		= (options.width)  	   ? options.width  	: 640;
	this.height 	= (options.height) 	   ? options.height 	: 480;
	this.title      = (options.title)	   ? options.title		: 'New Tone Matrix';
	this.line       = (options.line)	   ? options.line 		: 'rgba(255, 255, 255, 0.25)';

	this.textColor = this.color.substring(1);

	this.column = 0;
	// this.output = null;
	// this.playing = false;

	this.draw();
};

ToneMatrix.prototype.play = function(rows){
	var canvas = document.getElementById(this.color);
	var context = canvas.getContext('2d');
	var matrix = this.matrix;
	var instrument = T(this.instrument).play();
	var prevColumn = (this.column % 12) - 1;
	var column = this.column % 12;

	for(var row = 0; row < 12; row++) {
		context.clearRect(prevColumn * canvas.width / 12 + 1, row * canvas.height / 12 + 1, canvas.width / 12 - 2, canvas.height / 12 - 2);
		context.fillRect(prevColumn * canvas.width / 12 + 1, row * canvas.height / 12 + 1, canvas.width / 12 - 2, canvas.height / 12 - 2);
	}

	for(var row = 0; row < rows.length; row++) {
		instrument.noteOn(matrix[rows[row]][column] + 60, 80);

		context.fillRect(column * canvas.width / 12 + 1, rows[row] * canvas.height / 12 + 1, canvas.width / 12 - 2, canvas.height / 12 - 2);
	}

	this.column++;
}

// ToneMatrix.prototype.play = function() {
// 	if(!this.playing){
// 		var interval = 60000 / this.BPM;
// 		var matrix = this.matrix;
// 		var instrument = T(this.instrument).play();

// 		var canvas = document.getElementById(this.color);
// 		var context = canvas.getContext('2d');

// 		this.output = T('interval', { interval: 'L4' }, function(count) {
// 			var prevColumn = (count - 1) % 12;
// 			var column = count % 12;
// 			var rows = imageProcessor.getData(column, canvas.width, canvas.height);

// 			for(var i = 0; i < rows.length; i++) {
// 				var row = rows[i];

// 				context.clearRect(prevColumn * canvas.width / 12 + 1, row * canvas.height / 12 + 1, canvas.width / 12 - 2, canvas.height / 12 - 2);
// 				context.fillRect(prevColumn * canvas.width / 12 + 1, row * canvas.height / 12 + 1, canvas.width / 12 - 2, canvas.height / 12 - 2);
				
// 				instrument.noteOn(matrix[row][column] + 60, 80);

// 				context.fillRect(column * canvas.width / 12 + 1, row * canvas.height / 12 + 1, canvas.width / 12 - 2, canvas.height / 12 - 2);
// 			}
// 		}).start();
// 	}

// 	this.playing = true;
// }

ToneMatrix.prototype.draw = function() {
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');

	canvas.id = this.color;
	canvas.width = this.width;
	canvas.height = this.height;

	context.fillStyle = this.color;
	context.fillRect(0, 0, canvas.width, canvas.height);

	for(var x = 0; x < 12; x++) for(var y = 0; y < 12; y++) {
    	context.beginPath();
    	context.rect(x * canvas.width / 12, y * canvas.height / 12, canvas.width / 12, canvas.height / 12);
		context.lineWidth = 1;
		context.strokeStyle = 'rgba(255, 255, 255, 0.25)';
		context.stroke();
		context.closePath();
	}

	$('.square-wrapper').append('<div class="square-container" rel="' + this.title + '"><div class="square" id="' + this.title + '"></div><div class="tool-container"><h3 style="color: #' + this.textColor + ';">' + this.title + '</h3><div class="tools"><div class="knob-container"></div></div></div>');
	//console.log(this.textColor);
	$('#' + this.title).append('<table class="tablegrid" data-table-name="' + this.title + '"></table>');

	for(var i = 0; i < 12; i++) {
		var row = $('<tr data-sqtype="' + this.title + '"></tr>');
		for(var x = 0; x < 12; x++) row.append('<td></td>');
		row.appendTo('#' + this.title + ' table');
	}
	$('.knob-container')
	$('.knob').onselectstart = function () { return false; };
	$('.tick').onselectstart = function () { return false; };

}