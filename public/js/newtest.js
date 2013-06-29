//Init HTML5

window.URL = window.URL || window.webkitURL;
navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia || navigator.msGetUserMedia;

						
//Init Vars


var video = document.createElement('video');
var vW;
var vH;

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

var rColors = [0.7,0.7,1.1,1.2];
var gColors = [0.7,1.2,1.1,0.7];
var bColors = [1.2,0.7,0.7,0.7];
var rColor = bColor = gColor = 0;


function connectTo(ip, num){
	
	clientSocket = io.connect('http://'+ip+"/camera");

	clientSocket.on('handshake', function(data){
		camNumber = data;
		rColor = rColors[camNumber];
		gColor = gColors[camNumber];
		bColor = bColors[camNumber];
		clientSocket.emit('setCam', camNumber );
		console.log("Connected Camera as "+ camNumber);
		setInterval(processAndRender, 1000/20);
	});
	
	clientSocket.on('timeout', function(data){
		camNumber = null;
		console.log('Kicked from Server', timeout);
		clearInterval(processAndRender, 1000/20);
	});
}

//DRAWING VARS

var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');

var vcanvas = document.createElement('canvas');
var vcontext = vcanvas.getContext('2d');


$('body').append(canvas);

var maxMeasure = 10;
var measure = 0;

var oldData = null;
var newData = null

var size = 360;
var rows = 10;
var cols = 10;
var cellsPerCell = 4;

vcanvas.width = canvas.width = size;
vcanvas.height = canvas.height = size;

var x = 0;
var y = 0;


var density = [];


//Tailor vairs
var noChange = 15;
var maxChange = 300;
density = [];
for(var i= 0; i < cols; i+=1){
	var temp = [];
	for(var n = 0; n < rows; n+=1){
		temp.push(0);
	}
	density.push(temp);
}
//PROCESSING
function processAndRender(){
	
	context.globalAlpha = 1
	context.drawImage(video,0,0,canvas.width,canvas.height);
	newData = context.getImageData(0,0,canvas.width,canvas.height);
	for(var ii = 0; ii < newData.data.length; ii+=4){
		var grey = (newData.data[ii+0]+newData.data[ii+1]+newData.data[ii+2])/3;
		newData.data[ii+0] = Math.min(Math.round(grey * (rColor)),255);
		newData.data[ii+1] = Math.min(Math.round(grey * (gColor)),255);
		newData.data[ii+2] = Math.min(Math.round(grey * (bColor)),255);
	}
	context.putImageData(newData,0,0);
	newData = newData.data;
	
	// If we have data to cross compare
	if(!oldData)'hi'//density = null;
	else{
		if(oldData.length!=newData.length)console.log('error: ', oldData.length,',', newData.length, "don't match");
		else{
			//build density
			
			
			//Check every pixel we want
			x = 0;
			y = 0;
			var xx = 0;
			var yy = 0;
			for(var ii = 0; ii < oldData.length; ii+= 4*(size/cols)){
				x += (size/cols)
				if(x>=(size)){
					x = 0;
					y += 1;
				}
				yy = Math.floor((y/size)*cols - 0.1);
				xx = Math.floor((x/size)* rows - 0.1)
				
				//Cross compare colors
				temp = Math.abs(oldData[ii+0] - newData[ii+0]);
				
				//if(temp<noChange)temp = 0;
				temp = Math.min(temp, maxChange);
				temp /= maxChange;
				
				//Set Density
				try{
					//console.log( Math.floor((y/size)*cols))
					density[yy][xx] = (density[yy][xx]*0.95)+(temp * 0.2);
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
				//if(Math.random()>0.9999)console.log(density[i][n]);
				if(density[i][n] > 0.2){
					context.fillStyle = "rgba(255,255,255,"+density[i][n]+")";
					context.fillRect((n)*(size/cols), (i)*(size/rows), (size/cols)/2, (size/rows)/2);
				}
			}
		}
		
		
	
	}
	oldData = newData
	
	//This frame we measure
	if(measure==0){
		//Final Socket Call
		if(clientSocket){
			try{
				clientSocket.emit('frame',{
					cam: camNumber, 
					density: density, 
					pic: null
				});
			}catch(e){
				console.log('could not send??')
			}
		}	
		measure = maxMeasure;
	}else measure -= 1;
}
