//----------------------------------//
//--------------Routes--------------//
//----------------------------------//

var fs = require('fs');

// Templates
var menuTemplate = fs.readFileSync('views/_menu.html', 'utf8');
var cameraTemplate = fs.readFileSync('views/_camera.html', 'utf8');
var displayTemplate = fs.readFileSync('views/_display.html', 'utf8');
var applicationTemplate = fs.readFileSync('views/_application.html', 'utf8');

exports.index = function(req, res){
	res.render('index', { 
		title: 'Menu', 
		content: menuTemplate
	});
};

exports.camera = function(req, res){
	res.render('index', { 
		title: 'Camera', 
		content: cameraTemplate
	});
};

exports.display = function(req, res){
	res.render('index', { 
		title: 'Display', 
		content: displayTemplate
	});
};

exports.application = function(req, res){
	res.render('index', { 
		title: 'Application', 
		content: applicationTemplate
	});
};