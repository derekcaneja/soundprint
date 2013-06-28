//Init HTML5

window.URL = window.URL || window.webkitURL;
navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia || navigator.msGetUserMedia;

						
//Init Vars


var video = document.createElement('video');
var vW;
var vH;
var size = 400;

//Init Camera
if (navigator.getUserMedia) {
	navigator.getUserMedia({audio: false, video: true}, function(stream) {
		video.src = window.URL.createObjectURL(stream);
		video.autoplay = true;
		setTimeout(function() {
			vW = video.videoWidth;
			vH = video.videoHeight;
			connectTo('localhost');
		}, 1000);

	}, function(e){console.log('Could not get camera feed, '+e)});
} else {
	console.log('No browser support!');
}
 
//Networking
var clientSocket = null;
var sentData = null;
var camNumber = null;
function connectTo(ip, num){
	camNumber = num||0;
	
	clientSocket = io.connect('http://'+ip+"/camera");

	clientSocket.on('handshake', function(data){
		clientSocket.emit('setCam', camNumber);
		console.log("Connected Camera as "+ camNumber);
		setInterval(function(){
			processAndRender();
		}, 1000/20);
	});
}

//DRAWING VARS

var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');

var vcanvas = document.createElement('canvas');
var vcontext = vcanvas.getContext('2d');


$('body').append(canvas);

var maxMeasure = 1;
var measure = 0;

var oldData = null;
var newData = null

vcanvas.width = canvas.width = size;
vcanvas.height = canvas.height = size;

var x = 0;
var y = 0;

var rows = 40;
var cols = 40;

var density = [];


//Tailor vairs
var noChange = 15;
var maxChange = 300;
	
	
//PROCESSING
function processAndRender(){
	
	//This frame we measure
	if(measure==0){
		context.globalAlpha = 1
		context.drawImage(video,0,0,canvas.width,canvas.height);
		newData = context.getImageData(0,0,canvas.width,canvas.height).data;
		// If we have data to cross compare
		if(!oldData)density = null;
		else{
			if(oldData.length!=newData.length)console.log('error: ', oldData.length,',', newData.length, "don't match");
			else{
				//build density
				density = [];
				for(var i= 0; i < cols; i+=1){
					var temp = [];
					for(var n = 0; n < rows; n+=1){
						temp.push(0);
					}
					density.push(temp);
				}
				
				//Check every pixel we want
				x = 0;
				y = 0;
				for(var ii = 0; ii < oldData.length; ii+= 4*(size/cols)){
					x += (size/cols)
					if(x>=(size)){
						x = 0;
						y += 1;
					}
					
					//Cross compare colors
					var temp = 0;
					temp += Math.abs(oldData[ii+0] - newData[ii+0]);
					temp += Math.abs(oldData[ii+1] - newData[ii+1]);
					temp += Math.abs(oldData[ii+2] - newData[ii+2]);
					if(temp<noChange)temp = 0;
					temp = Math.min(temp, maxChange);
					temp /= maxChange;
					
					//Set Density
					try{
						//console.log( Math.floor((y/size)*cols))
						density[Math.floor((y/size)*cols - 0.1)][ Math.floor((x/size)* rows - 0.1)] = temp;
					}catch(e){
						//console.log('DIDNT HAVE', Math.floor((y/size)*cols),Math.floor((x/size)* rows))
					}
						
					
				}
			}
			
			//Draw the density
			for(var i = 0; i < rows; i += 1){
				for(var n = 0; n < cols; n += 1){
					//densityArray[i][n] /= (vtSize*hzSize);
					//densityArray[i][n] = densityArray[i][n]*2.5;
					//densityArray[i][n] = Math.round(densityArray[i][n]*100)/100;
					if(Math.random()>0.9999)console.log(density[i][n]);
					if(density[i][n] > 0.2){
						context.fillStyle = "rgba(255,0,0,"+density[i][n]+")";
						context.fillRect((n)*(size/cols), (i)*(size/rows), (size/cols), (size/rows));
					}
				}
			}
			
			//Final Socket Call
			if(clientSocket){
				clientSocket.emit('frame', 
				{
					cam: camNumber, 
					density: density, 
					pic: null
				});
			}	
		
		}
		oldData = newData
		measure = maxMeasure;
		
	}else measure -= 1;
}
