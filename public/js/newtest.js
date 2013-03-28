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
var size = 400;
bg.width = bg.height = size;
var pix = null;
var oldPicData;
var sentData;
var totalPix = size*size;
var sensitivity = 30;
var hzChunk = 16;
var vtChunk = 16;
var hzSize = size/hzChunk;
var vtSize = size/vtChunk;
var x,y,r,c = 0;
var rr = 125;
var gg = 125;
var bb = 125;
var rrr = 255;
var ggg = 255;
var bbb = 255;
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
	onFailSoHard("A");
}


var onFailSoHard = function(e) {
	console.log('Reeeejected!', e);
};
 
var clientSocket = null;
var sentData = null;
k.beforeRender = function(){
	this.context.fillStyle = "rbga("+rrr+","+ggg+","+bbb+",255)";
	this.context.fillRect(0,0,this.canvas.width, this.canvas.height);
	this.context.save();
	this.context.scale(size/bg.width, size/bg.height);
	this.context.drawImage(video,0,0,size,size);
	this.context.restore();
	var densityArray = [];
	boxBlurCanvasRGB(this.canvas, 0,0, size, size, 2, 1);
	for(var i= 0; i < vtChunk; i+=1){
		var temp = [];
		for(var n = 0; n < hzChunk; n+=1){
			temp.push(0);
		}
		densityArray.push(temp);
	}
	console.log("ok");
	if(bgd!=null){
		oldPic = this.context.getImageData(0,0,size, size);
		oldPicData = oldPic.data;
		sentData = null;
		for(var i = 0, n = 0; i < oldPicData.length && i < bgd.length; i+=4, n+=1){
			x = (n%size)
			y = Math.floor(n/size)
			r = Math.floor((x/size)*hzChunk);
			c = Math.floor((y/size)*vtChunk);
			this.cumDif = 	Math.round(
							dif(oldPicData[i],bgd[i]) + 
							dif(oldPicData[i+1],bgd[i+1]) + 
							dif(oldPicData[i+2],bgd[i+2]));
							
			
			if(this.cumDif > 255)this.cumDif = 255;
			
			
			if(this.cumDif > 40){
				densityArray[c][r] += 1;
				oldPicData[i] = 
				oldPicData[i+1] =
				oldPicData[i+2] = 0;
			}else{
				oldPicData[i] = 
				oldPicData[i+1] =
				oldPicData[i+2] = 255;
			}
			
			
		}
		this.context.putImageData(oldPic,0,0);
		sentData = this.canvas.toDataURL("image/png");
		//
		for(var i = 0; i < vtChunk; i+=1){
			for(var n = 0; n < hzChunk; n+=1){
				densityArray[i][n] /= (vtSize*hzSize);
				densityArray[i][n] = densityArray[i][n]*2.5;
				//densityArray[i][n] = Math.round(densityArray[i][n]*100)/100;
				this.context.fillStyle = "rgba(255,0,0,"+(densityArray[i][n]/2)+")";
				this.context.fillRect(n*hzSize, i*vtSize , hzSize, vtSize);
			}
		}
		if(clientSocket){
			clientSocket.emit('frame', 
			{
				cam:camNumber, 
				density: densityArray, 
				pic:null
			});
		}		
	}
	
}

function dif(x1,x2){
	return Math.abs(x1-x2);
}

function grabBG(){
	bg.width = bg.width;
	bgc.save();
	bgc.scale(size/bg.width, size/bg.height);
	bgc.drawImage(video,0,0,size,size);
	bgc.restore();
	boxBlurCanvasRGB(bg, 0,0, size, size, 2, 1);
	bgd = bgc.getImageData(0,0,size,size).data;
}

//Networking
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