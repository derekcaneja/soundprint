var squareSize = 23/100 * $(window).width() * 92/100;
var toneMatrix1 = new ToneMatrix({ width: squareSize, height: squareSize, color: '#3498DB', instrument: 'PluckGen', title: 'Bass', gridcolor: '#2980B9' });
var toneMatrix2 = new ToneMatrix({ width: squareSize, height: squareSize, color: '#2ECC71', instrument: 'PluckGen', title: 'Rhythm', gridcolor: '#27AE60' });
var toneMatrix3 = new ToneMatrix({ width: squareSize, height: squareSize, color: '#F1C40F', instrument: 'PluckGen', title: 'Harmony', gridcolor: '#F39C12' });
var toneMatrix4 = new ToneMatrix({ width: squareSize, height: squareSize, color: '#E74C3C', instrument: 'PluckGen', title: 'Melody', gridcolor: '#C0392B' });

toneMatrix1 = new DisplayToneMatrixView({ model: toneMatrix1 });
toneMatrix2 = new DisplayToneMatrixView({ model: toneMatrix2 });
toneMatrix3 = new DisplayToneMatrixView({ model: toneMatrix3 });
toneMatrix4 = new DisplayToneMatrixView({ model: toneMatrix4 });

var toneMatrix = [toneMatrix1, toneMatrix2, toneMatrix3, toneMatrix4];

var header = new HeaderView();
var content = [toneMatrix1, toneMatrix2, toneMatrix3, toneMatrix4];

var application = new DisplayView({ header: header, content: content});
$('body').append(application.el);
$('.square').height($('.square-container').width());

$('body').append('<h1>#BigKC is making noise!</h1><h5>Soundprint lets you create custom songs from the movement of everyone in the room.</h5>'
