//----------------------------------//
//-----------Application------------//
//----------------------------------//

var dev = false;

var express = require('express')
  , hbs = require('hbs')
  , io = require('socket.io')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');
   
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 5555);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.engine('html', require('hbs').__express);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '/public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/'			 	, 	    routes.index);
app.get('/camera'		, 	   routes.camera);
app.get('/application'	, routes.application);
app.get('/display'		, 	  routes.display);


var server = http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});

io = io.listen(server);

io.configure('development', function(){
	io.set('log level', 0);
});


// Sockets
var cameraSocket 	  = io.of('/camera');
var applicationSocket = io.of('/application');
var displaySocket     = io.of('/display');


// Clients
var cameraClients 	   = [null, null, null, null];
var applicationClients = [];
var displayClients     = [];

var cameraData = [];
var onCamMaybe = 0;
var maxTimeOut = 3;
var timeOut = [0,0,0,0];
var imd = [null, null, null, null];
var dns = [null, null, null, null];
var compression = 4;
	
cameraSocket.on('connection', function(socket){
	var open = getOpenCamera();
	
	if(open == -1) return socket.emit('handshake', 'Only 4 cameras supported at this time!');
	
	socket.emit('handshake', null, open);

	console.log('Camera ' + open + ' connected');
	
	cameraClients[open] = socket;

	socket.on('frame', function(data){
		//console.log('frame from ',data.cam);
		timeOut[data.cam] = maxTimeOut;
		
		if(data.pic)	 imd[data.cam] = data.pic;
		if(data.density) dns[data.cam] = data.density;
	});

	socket.on('disconnect', function() {
		var i = cameraClients.indexOf(socket);
		cameraClients[i] = null;

		console.log('Camera ' + i + ' disconnected');
	});
});

applicationSocket.on('connection', function(socket) {
	applicationClients.push(socket);
	
	socket.emit('handshake', applicationClients.length - 1);

	console.log(applicationClients.length + ' application(s) connected');
	
	socket.on('request', function(dat){
		if(applicationClients[dat.index]){
			applicationClients[dat.index].volatile.emit('sendData', {
				density : dns,
				pics    : ((dat.vids) ? (imd) : (null))
			});
		};
	})
});

function getOpenCamera() {
	for(var i = 0; i < cameraClients.length; i++) {
		if(!cameraClients[i]) return i;
	}

	return -1;
}