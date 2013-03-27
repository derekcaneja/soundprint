//-----------------------------------------//
//---------------Application---------------//
//-----------------------------------------//

var squareSize = 23/100 * $(window).width() * 92/100;
var toneMatrix1 = new ToneMatrix({ width: squareSize, height: squareSize, color: '#3498DB', instrument: 'PluckGen', title: 'Bass', gridcolor: '#2980B9' });
var toneMatrix2 = new ToneMatrix({ width: squareSize, height: squareSize, color: '#2ECC71', instrument: 'PluckGen', title: 'Rhythm', gridcolor: '#27AE60' });
var toneMatrix3 = new ToneMatrix({ width: squareSize, height: squareSize, color: '#F1C40F', instrument: 'PluckGen', title: 'Harmony', gridcolor: '#F39C12' });
var toneMatrix4 = new ToneMatrix({ width: squareSize, height: squareSize, color: '#E74C3C', instrument: 'PluckGen', title: 'Melody', gridcolor: '#C0392B' });

toneMatrix1 = new ToneMatrixView({ model: toneMatrix1 });
toneMatrix2 = new ToneMatrixView({ model: toneMatrix2 });
toneMatrix3 = new ToneMatrixView({ model: toneMatrix3 });
toneMatrix4 = new ToneMatrixView({ model: toneMatrix4 });



var header = new HeaderView();
var content = [toneMatrix1, toneMatrix2, toneMatrix3, toneMatrix4];
var footer = new FooterView();

var application = new ApplicationView({ header: header, content: content, footer: footer });

$('body').append(application.el);


$('.square').height($('.square-container').width());
//$('.square-border').height($('.square-container').height()+$('.tool-container').height());


var toneMatrix = [toneMatrix1, toneMatrix2, toneMatrix3, toneMatrix4];

//Connections
function connectTo(ip){
	clientSocket = io.connect('http://'+ip+"/application");

	clientSocket.on('frame', function(data){
		toneMatrix[data.cam].sendFrame(data.data);
	});
}
//

//timbre
var BPM = 120;

var bass 	= T('PluckGen').play();
var rhythm  = T('PluckGen').play();
var harmony = T('PluckGen').play();
var melody  = T('PluckGen').play();

var bassMatrix 	  = createToneMatrix(56, 16, 16);
var rhythmMatrix  = createToneMatrix(56, 16, 16);
var harmonyMatrix = createToneMatrix(56, 16, 16);
var melodyMatrix  = createToneMatrix(56, 16, 16);

var bassData = [ 	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,], 
					[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]	];

var rhythmData = [ 	[1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]	];

var harmonyData = [ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,], 
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]	];

var melodyData = [ 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,], 
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]	];

var metronome = T('interval', { interval: 'BPM' + BPM + ' L16' }, function(count) {
	var row = count % 16;

	for(var column = 0; column < bassMatrix[row].length; 	column++) 	if(bassData[row][column] == 1) 	  bass.noteOn(bassMatrix[row][column], 80);
	for(var column = 0; column < rhythmMatrix[row].length; 	column++) 	if(rhythmData[row][column] == 1)  rhythm.noteOn(rhythmMatrix[row][column], 80);
	for(var column = 0; column < harmonyMatrix[row].length; column++) 	if(harmonyData[row][column] == 1) harmony.noteOn(harmonyMatrix[row][column], 80);
	for(var column = 0; column < melodyMatrix[row].length; 	column++)	if(melodyData[row][column] == 1)  melody.noteOn(melodyMatrix[row][column], 80);
});

metronome.start();

function createToneMatrix(baseNote, width, height) {
	var matrix = new Array();

	for(var row = height; row > 0; row--) {
		var temp = new Array();

		for(var column = 0; column < width; column++) {
			var note = baseNote + row + column;

			if(note > baseNote + width - 1) note = note - width;

			temp.push(note);
		} 

		matrix.push(temp);
	}

	return matrix;
}
