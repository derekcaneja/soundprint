//----------------------------------//
//--------------Routes--------------//
//----------------------------------//

var os = require('os');

exports.index = function(req, res){
	res.render('_menu', { title: 'Soundprint' });
};

exports.camera = function(req, res){
	var ipAddress = getServerIp(req);

	res.render('_camera', { title: 'Soundprint | Camera', IPv4: ipAddress });
};

exports.display = function(req, res){
	var ipAddress = getServerIp(req);

	res.render('_display', { title: 'Soundprint | Display', IPv4: ipAddress });
};

exports.application = function(req, res){
	var ipAddress = getServerIp(req);

	res.render('_application', { title: 'Soundprint | Application', IPv4: ipAddress });
};

function getServerIp(req) {
	var interfaces = os.networkInterfaces();
	var addresses = [];
	
	for (k in interfaces) {
	    for (k2 in interfaces[k]) {
	        var address = interfaces[k][k2];
	        if (address.family == 'IPv4' && !address.internal) {
	            addresses.push(address.address)
	        }
	    }
	}

	return addresses[0];
}