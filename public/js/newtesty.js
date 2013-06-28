window.URL = window.URL || window.webkitURL;
navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia || navigator.msGetUserMedia;

var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');

var size = 400;

$('#cc').width(size*2);
$('#cc').height(size);
canvas.width = size*2;
canvas.height = size;
$('#cc').append(canvas);


 
var clientSocket = null;

var rows = 8;
var cols = 8;

var r, c, w, h= 0;


var camera = cv.VideoCapture(0);
var toSend = null;
var captured = false;
var densityArray = [];
var max = [];
camera.read(function(image){
	toSend = []
	if(!captured){
		w = image.width;
		h = image.height;
		image.detectObject(cv.FACE_CASCADE, {}, function(err, faces){
			if(err){
				console.log('err in image detection');
				return false;
			}
			densityArray = [];
			max = [];
			for(var i= 0; i < cols; i+=1){
				var temp = [];
				max.push(1);
				for(var n = 0; n < rows; n+=1){
					temp.push(0);
				}
				densityArray.push(temp);
			}
			for (var i = 0; i < faces.length; i++){
				var x = faces[i];
				x.width = x.height = Math.min(x.width, x.height);
				toSend.push(x);
				//
				r = Math.floor((x.x/w)*rows);
				c = Math.floor((x.y/h)*cols);
				//
				densityArray[c][r] += 1;
				if(densityArray[c][r]> max[r])max[r]
			}
			//
			for(var i = 0; i < densityArray.length; i+=1){
				for(var n = 0; n < densityArray[i].length; n+=1){
					densityArray /= max[n];
				}
			}
			//
			drawDensityToCanvas(densityArray);
			//
			if(clientSocket)clientSocket.emit('frame', {
				cam: camNumber,
				faces: toSend,
				density: densityArray
			});
		});
		captured = true;
		setTimeOut(function(){
			captured = false;
		}, 1000/3);
	}
	drawImageToCanvas(image);
});

function drawImageToCanvas(img){
	var buffer = img.toBuffer();
	var array = new Int64Array(buffer);
	console.log(array.length);
}

function drawDensityToCanvas(ar){
	context.save();
	context.translate(size,0);
	context.fillStyle= "#FFFFFF";
	context.fillRect(0,0,size,size);
	for(var i = 0; i < ar.length; i+=1){
		for(var n = 0; n < ar[i].length; n+=1){
			context.fillStyle = "#FF0000";
			context.globalAlpha = ar[i][n]/2;
			context.fillRect(i*(size/cols), n*(size/rows), (size/cols), (size/rows));
		}
	}
	context.restore();
}


//Networking
var mainIP;
var camNumber = null;
function connectTo(ip, num){
	camNumber = num||0;
	
	clientSocket = io.connect('http://'+ip+"/camera");

	clientSocket.on('handshake', function(data){
		clientSocket.emit('setCam', camNumber);
		console.log("Connected Camera as "+ camNumber);
		setInterval(function(){
			grabBG();
		}, 1000);
	});
}
function reconnect(){
	try(
}