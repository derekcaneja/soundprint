var VideoCapture = function(options) {

	// Check for options and give blank JSON if none
	options = (options) ? options : {};

	// Defaults
	this.video 	= (options.video)  ? options.video  : document.createElement('video');
	this.width 	= (options.width)  ? options.width  : 640;
	this.height = (options.height) ? options.height : 480;
	this.fps   	= (options.fps)    ? options.fps	: 30;
	this.start 	= (options.start)  ? options.start  : false;

	this.video.width = this.width;
	this.video.height = this.height;

	if(this.start) {
		this.draw();
		this.createCanvas('capture', true);
		this.startCapture(); 
	}
}

VideoCapture.prototype.startCapture = function() {
	var video = this.video;

	compatibility.getUserMedia({ video: true }, function(stream){
		video.src = compatibility.URL.createObjectURL(stream);
		video.play();
		videoCapture.storeOnCanvas('capture');
	}); 
}

VideoCapture.prototype.draw = function() {
	//this.video.style.display = 'none';
	$('body').append(this.video);
}

VideoCapture.prototype.createCanvas = function(canvasID, draw) {
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');

	canvas.id = canvasID;
	canvas.width = this.video.width;
	canvas.height = this.video.height;

	if(draw) this.drawCanvas(canvas);
}

VideoCapture.prototype.drawCanvas = function(canvas) {
	$('body').append(canvas);
}

VideoCapture.prototype.storeOnCanvas = function(canvasID) {
	var canvas 	= document.getElementById(canvasID);
	var context = canvas.getContext('2d');

	var video = this.video;

	setInterval(function() { 
		context.drawImage(video, 0, 0, video.width, video.height) 
		mixBoard.play();
		//imageProcessor.getDetectedObjects('capture');
	}, 1000 / this.fps);
}