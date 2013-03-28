//-----------------------------------------//
//---------------Application---------------//
//-----------------------------------------//
var squareSize = 23/100 * $(window).width() * 92/100;
var toneMatrix1 = new ToneMatrix({ width: squareSize, height: squareSize, color: '#3498DB', instrument: bassSynth, 	  matrix: synthMatrixFinal.matrix, title: 'Bass', gridcolor: '#2980B9' });
var toneMatrix2 = new ToneMatrix({ width: squareSize, height: squareSize, color: '#2ECC71', instrument: rhythmSynth,  matrix: synthMatrixFinal.matrix, title: 'Rhythm', gridcolor: '#27AE60' });
var toneMatrix3 = new ToneMatrix({ width: squareSize, height: squareSize, color: '#F1C40F', instrument: harmonySynth, matrix: synthMatrixFinal.matrix, title: 'Harmony', gridcolor: '#F39C12' });
var toneMatrix4 = new ToneMatrix({ width: squareSize, height: squareSize, color: '#E74C3C', instrument: melodySynth,  matrix: synthMatrixFinal.matrix, title: 'Melody', gridcolor: '#C0392B' });

toneMatrix1 = new ToneMatrixView({ model: toneMatrix1 });
toneMatrix2 = new ToneMatrixView({ model: toneMatrix2 });
toneMatrix3 = new ToneMatrixView({ model: toneMatrix3 });
toneMatrix4 = new ToneMatrixView({ model: toneMatrix4 });

var colors = [
{
	r:16,
	g:73,
	b:112,
	r2:52,
	g2:152,
	b2:219,
},
{
	r:16,
	g:112,
	b:56,
	r2:46,
	g2:204,
	b2:113,
},
{
	r:112,
	g:75,
	b:16,
	r2:241,
	g2:196,
	b2:15,
},
{
	r:112,
	g:25,
	b:16,
	r2:231,
	g2:76,
	b2:60,
}];

var header = new HeaderView();
var content = [toneMatrix1, toneMatrix2, toneMatrix3, toneMatrix4];
var footer = new FooterView();

var application = new ApplicationView({ header: header, content: content, footer: footer });

$('body').append(application.el);


$('.square').height($('.square-container').width());
$('.square-border').height($('.square').height()+$('.tool-container').height()+15);
$('.square-border').width($('.square-border').parent().width() + 8);


var toneMatrix = [	toneMatrix1,
					toneMatrix2,
					toneMatrix3,
					toneMatrix4];

//Connections
var clientSocket;
function connectTo(ip){
	clientSocket = io.connect('http://'+ip+"/application");

	clientSocket.on('handshake', function(){
		console.log('handshake');
		startthis();
	});
	
	clientSocket.on('sendCamData', function(xx){
		if(xx){
			toneMatrix[xx.cam].sendData(xx);
		}
		
	});
}
$(window).mouseup(function(){ 
	toneMatrix1.reverb.rotate = false;
	toneMatrix1.delay.rotate = false;
	toneMatrix1.gain.rotate = false;
	toneMatrix2.reverb.rotate = false;
	toneMatrix2.delay.rotate = false;
	toneMatrix2.gain.rotate = false;	
	toneMatrix3.reverb.rotate = false;
	toneMatrix3.delay.rotate = false;
	toneMatrix3.gain.rotate = false;	
	toneMatrix4.reverb.rotate = false;
	toneMatrix4.delay.rotate = false;
	toneMatrix4.gain.rotate = false;
});
//
var playing = false;
var bpm = 50;
var minute = 60 * 1000;
var beatTime = (minute/bpm)/8;
var onBeat = 0;
var fpsTime = 1000/30;

function startthis(){
	if(!playing){
		playing = true;
		setInterval(function(){
			onBeat+=1
			if(onBeat == 16)onBeat = 0;
			for(var i = 0; i < toneMatrix.length; i+=1){
				toneMatrix[i].setBar(onBeat, beatTime/fpsTime);
			}
			
		}, beatTime);
		setInterval(function(){
			for(var i = 0; i < toneMatrix.length; i+=1){
				toneMatrix[i].render();
			}
			
		}, fpsTime);
		T('audio', { loop: true }).load('/js/libs/timbre/drum.wav', function(){
			this.play();
		});
	}
}

function rotateMatrix(xx){

	this.toRet = [];
	//
	for(var i= 0; i < xx.length; i+=1){
		this.temp = [];
		for(var n = 0; n < xx[i].length; n+=1){
			this.temp.push(0);
		}
		this.toRet.push(temp);
	}
	//
	for(var i = 0; i < xx.length; i+=1){
		this.maxN = xx[i].length-1;
		for(var n = 0; n <= maxN; n+=1){
			toRet[i][n] = xx[maxN - n][i];
		}
	}
	
	
	return toRet;
}
