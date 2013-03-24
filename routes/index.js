var fs = require('fs')
  , imagesnap = require('imagesnap');

exports.index = function(req, res){
	// setInterval(function(){
	// 	var date = new Date();
	// 	var imageStream = fs.createWriteStream('data/' + date + '.jpg');
	// 	imagesnap().pipe(imageStream);
	// }, 1000);
  	res.render('index', { title: 'Express' });
};