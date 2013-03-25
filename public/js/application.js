//-----------------------------------------//
//---------------Application---------------//
//-----------------------------------------//

var squareSize = 23/100 * $(window).width() * 92/100;
var toneMatrix1 = new ToneMatrix({ width: squareSize, height: squareSize, color: '#3498DB', instrument: 'PluckGen', title: 'Bass' });
var toneMatrix2 = new ToneMatrix({ width: squareSize, height: squareSize, color: '#2ECC71', instrument: 'PluckGen', title: 'Rhythm' });
var toneMatrix3 = new ToneMatrix({ width: squareSize, height: squareSize, color: '#F39C12', instrument: 'PluckGen', title: 'Harmony' });
var toneMatrix4 = new ToneMatrix({ width: squareSize, height: squareSize, color: '#E74C3C', instrument: 'PluckGen', title: 'Farts' });

toneMatrix1 = new ToneMatrixView({ model: toneMatrix1 });
toneMatrix2 = new ToneMatrixView({ model: toneMatrix2 });
toneMatrix3 = new ToneMatrixView({ model: toneMatrix3 });
toneMatrix4 = new ToneMatrixView({ model: toneMatrix4 });

var header = new HeaderView();
var content = [toneMatrix1, toneMatrix2, toneMatrix3, toneMatrix4];

var application = new ApplicationView({ header: header, content: content });

$('body').append(application.el);

$('.square').height($('.square-container').width());
$('.tablegrid').outerHeight($('.square-container').width());