//----------------------------------//
//--------------Routes--------------//
//----------------------------------//

exports.index = function(req, res){
	res.render('_menu', { title: 'Menu' });
};

exports.camera = function(req, res){
	res.render('_camera', { title: 'Camera' });
};

exports.display = function(req, res){
	res.render('_display', { title: 'Display' });
};

exports.application = function(req, res){
	res.render('_application', { title: 'Application' });
};