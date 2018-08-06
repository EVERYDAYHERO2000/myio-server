const config = require('./src/config');
const app = require('express')();
const url = require('url');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const httpRequests = require('./src/http-requests.js');



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
			
			httpRequests(request.method, chunk.toString(), function(e){
				response.header("Access-Control-Allow-Origin", "*");
				response.header("Access-Control-Allow-Headers", "X-Requested-With");
				response.json(e);
				console.log(e);
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
 
http.listen(config.ports.http, function () {
	console.log('listening on *:' + config.ports.http);
});


