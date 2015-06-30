var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var clientSockets = {};

app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
	res.sendFile(__dirname + "/index.html");
});

io.on('connection', function(socket){
	clientSockets[socket.id] = socket;

	socket.on('chat message', function(payload){
		io.emit('chat message', payload);
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
})

