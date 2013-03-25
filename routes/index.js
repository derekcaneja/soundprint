// var cv = require('opencv')
//   , T  = require('timbre')
//   , fs = require('fs');

// var camera = new cv.VideoCapture(0);

// var FIRST_IMAGE = new Array();

// var count = 0;

// setInterval(function() {
// 	camera.read(function(image) {
// 		var width = image.width();
// 		var height = image.height();

// 		if(FIRST_IMAGE.length == 0) {
// 			for(var y = 0; y < height - 1; y++) {
// 				FIRST_IMAGE.push(image.pixelRow(y));
// 			}
// 		} else {
// 			for(var y = 0; y < height - 1; y++) {
// 				for(var x = 0; x < width - 1; x++) {
// 					if(FIRST_IMAGE[y][x] == image.pixelRow(y)[x]) {
// 						count++;
// 					}
// 				}
// 			}
// 		}

// 		if(count > width / 2) {
// 			console.log('no change');
// 		} else {
// 			console.log('change');
// 		}

// 		count = 0;
// 		// im.detectObject('./node_modules/opencv/data/haarcascade_frontalface_alt2.xml', {}, function(err, faces) {

// 		// 	for(var k = 0; k < faces.length; k++) {
// 		// 		face = faces[k];
// 		// 		im.rectangle([face.x, face.y], [face.x + face.width, face.y + face.height], 'rgb(0,0,0)', 2);
// 		// 	}

// 		// 	im.save('./data/tmp/test' + i + '.jpg');
// 		// 	i++;
// 		// });
// 	});
// }, 1000);

exports.index = function(req, res){
	res.render('index', { title: 'Express' });
};