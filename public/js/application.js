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

var toneMatrix = [	toneMatrix1,
					toneMatrix2,
					toneMatrix3,
					toneMatrix4]

//Connections
function connectTo(ip){
	clientSocket = io.connect('http://'+ip+"/application");

	clientSocket.on('frame', function(data){
		toneMatrix[data.cam].sendFrame(data.data);
	});
}
//
