window.URL = window.URL || window.webkitURL;
navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia || navigator.msGetUserMedia;

var video = document.createElement('video');
var k = new Kanvas({parentID:"cc", bgColor:"none", baseFPS:12, animated:true, handleScale:false});
var bg = document.createElement('canvas');
var bgc = bg.getContext('2d');
var bgd = null;
var newPic;
var oldPic;
var vW;
var vH;
var size = 200;
bg.width = bg.height = size;
var pix = null;
var oldPicData;
var totalCount = 0;
var totalPix = size*size;
var sensitivity = 30;
var maxSensitivity = 120;
var minSensitivity = 40;
var hzChunk = 16;
var vtChunk = 16;
var hzSize = size/hzChunk;
var vtSize = size/vtChunk;
var x,y,r,c = 0;
if (navigator.getUserMedia) {
	navigator.getUserMedia({audio: true, video: true}, function(stream) {
		video.src = window.URL.createObjectURL(stream);
		video.autoplay = true;
		setTimeout(function() {
			console.log(video.videoWidth, video.videoHeight);
			$("#cc").width(size);
			$("#cc").height(size);
			vW = video.videoWidth;
			vH = video.videoHeight;
			k.start();
		}, 1000);

	}, onFailSoHard);
} else {
	onFailSoHard
}


var onFailSoHard = function(e) {
	console.log('Reeeejected!', e);
};
 
var clientSocket = null;
k.beforeRender = function(){
	this.context.fillStyle = "#FFFFFF";
	this.context.fillRect(0,0,this.canvas.width, this.canvas.height);
	this.context.save();
	this.context.scale(size/bg.width, size/bg.height);
	this.context.drawImage(video,0,0,size,size);
	this.context.restore();
	var densityArray = [];
	for(var i= 0; i < vtChunk; i+=1){
		var temp = [];
		for(var n = 0; n < hzChunk; n+=1){
			temp.push(0);
		}
		densityArray.push(temp);
	}
	boxBlurCanvasRGB(k.canvas, 0,0,size,size,2,1);
	if(bgd!=null){
		oldPic = this.context.getImageData(0,0,size, size);
		oldPicData = oldPic.data;
		totalCount = 0;
		for(var i = 0, n = 0; i < oldPicData.length && i < bgd.length; i+=4, n+=1){
			x = (n%size)
			y = Math.floor(n/size)
			r = Math.floor((x/size)*hzChunk);
			c = Math.floor((y/size)*vtChunk);
			if(	dif(oldPicData[i],bgd[i]) &&
				dif(oldPicData[i+1],bgd[i+1]) &&
				dif(oldPicData[i+2],bgd[i+2])){
				oldPicData[i] = oldPicData[i+1] = oldPicData[i+2] = 255;
				totalCount += 1;
				densityArray[c][r] += 1;
			}else oldPicData[i] = oldPicData[i+1] = oldPicData[i+2] = 0;
		}
		this.context.putImageData(oldPic,0,0);
		if(totalCount/totalPix < 0.8){
			sensitivity += 4;
		}else if(totalCount/totalPix > 0.9){
			sensitivity -= 4;
		}
		if(sensitivity>maxSensitivity)sensitivity = maxSensitivity;
		if(sensitivity<minSensitivity)sensitivity = minSensitivity;
		//
		for(var i = 0; i < vtChunk; i+=1){
			for(var n = 0; n < hzChunk; n+=1){
				densityArray[i][n] /= (vtSize*hzSize);
				this.context.fillStyle = "rgba(255,0,0,"+((1-densityArray[i][n])/2)+")";
				this.context.fillRect(n*hzSize, i*vtSize , hzSize, vtSize);
			}
		}
		if(clientSocket){
			clientSocket.emit('frame', densityArray);
		}
	}
	
}

function newMat(rs,cs){
	this.keyDown = [];////
	this.preventedKeys = new myArray(8);
	for(ii = 0; ii < 250; ii+=1)this.keyDown[ii] = false; //Populate this.keyDown Array
}
function dif(x1,x2){
	return Math.abs(x1-x2)<sensitivity;
}

function grabBG(){
	bgd = null;
	k.beforeRender();
	bgc.drawImage(k.canvas,0,0);
	bgd = bgc.getImageData(0,0,size,size).data;
}

//Networking

var camNumber = null;
function connectTo(ip, num){
	camNumber = num||0;
	clientSocket = io.connect('http://'+ip+"/camera");

	clientSocket.on('handshake', function(){
		clientSocket.emit('setCam', camNumber);
		console.log("Connected Camera as "+ camNumber);
	});
	
}
