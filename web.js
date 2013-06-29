//----------------------------------//
//-----------Application------------//
//----------------------------------//

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
app.get('/display'		, 	  routes.display);
app.get('/application'	, routes.application);

var server = http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});

io = io.listen(server);

io.configure('development', function(){
	io.set('log level', 0);
});

var cameraSocket = io.of('/camera');
var applicationSocket = io.of('/application');
var cameraClient = [];;
var applicationClient = [];
var cameraData = [];
var onCam = 0;
var onCamMaybe = 0;
var maxTimeOut = 3;
var timeOut = [0,0,0,0];
var imd = [null, null, null, null];
var dns = [null, null, null, null];
var compression = 4;

for(var i = 0; i < 4; i+=1) cameraData[i] = null;
	
cameraSocket.on('connection', function(socket){	
	socket.emit('handshake', onCam);
	cameraClient.push(socket);
	onCam += 1;
	socket.on('setCam', function(number){
		console.log('Connected Camera Number ' + number);
	});

	socket.on('frame', function(data){
		//console.log('frame from ',data.cam);
		timeOut[data.cam] = maxTimeOut;
		if(data.pic)imd[data.cam] = data.pic;
		if(data.density)dns[data.cam] = data.density;
	});
	
	
});

applicationSocket.on('connection', function(socket) {
	applicationClient.push(socket);
	socket.emit('handshake', applicationClient.length-1);
	
	socket.on('request', function(dat){
		//console.log('request', dat.vids);
		if(applicationClient[dat.index]){
			applicationClient[dat.index].volatile.emit('sendData',{
				density: dns,
				pics: ((dat.vids)?(imd):(null))
			})
		};
	})
});

setInterval(checkTimeOut, 1000)

function checkTimeOut(){
	for(var ii = 0; ii < timeOut.length; ii+=1){
		if(timeOut[ii] > 0){
			timeOut[ii] = timeOut[ii] - 1;
			if(timeOut[ii]<=0){
				console.log('timeout on cam', ii);
				if(cameraClient[ii]){
					
					cameraClient[ii].send('timeOut');
					cameraClient[ii] = null;
				}
				imd[ii] = null;
				dns[ii] = null;
			}
		}else{
			onCam = Math.min(onCam, ii);
		}
	}
}
