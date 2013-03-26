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

var serverSocket = io.listen(server);
var clients = [];
for(var i = 0; i < 6; i+=1)clients[i] = null;
serverSocket.on('connection', function(socket){
	//
	var me = socket;
	
	socket.emit('lol');
	
	socket.on('ping', function(data){
		console.log(data);
	});
	//
	socket.on('setCam', function(number){
		clients[number] = me;
		console.log("Connected Camera Number "+number);
	});
	//
	socket.on('frame', function(data){
		var toPrint = "";
		for(var i = 0; i < data.length; i++){
			toPrint = "" + toPrint + "\n";
			for(var n = 0; n < data[i].length; n++){
				toPrint = ""+toPrint+((data[i][n]<0.5)?("#"):("."));
			}
			
		}
		console.log(toPrint);
	});
});
