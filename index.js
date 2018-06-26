var config = require('./src/config');
var app = require('express')();
var url = require('url');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var httpRequests = require('./src/http-requests.js');



app.all('/', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.post('/api', function (request, response) {
	
	//если запрос на порт 
	if (request.headers.host.indexOf(config.ports.http) + 1) {

		request.on('data', function (chunk) {
			var data = chunk.toString();
			var method = request.method;
			
			httpRequests(method, data, function(e){
				response.header("Access-Control-Allow-Origin", "*");
				response.header("Access-Control-Allow-Headers", "X-Requested-With");
				response.json(e);
				
			});
			
			
			
		});
	}
});


io.on('connection', function (socket) {
	socket.on('chat message', function (msg) {
		io.emit('chat message', msg);
	});
});

io.emit('some event', {
	for: 'everyone'
});
/*
http.on('request', function (request, response) {
		console.log(request.method);

});
*/
http.listen(config.ports.http, function () {
	console.log('listening on *:' + config.ports.http);
});


