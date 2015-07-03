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
	clientSockets[socket.id] = {
		socket: socket,
		participant_name: ""
	};

	socket.on('player connected', function(data){
		clientSockets[socket.id].participant_name = data;
		socket.broadcast.emit('new member', data);
	});

	socket.on('chat message', function(payload){
		socket.broadcast.emit('chat message', payload);
	});

	socket.on('user typing', function(){
		console.log("user started typing");
		socket.broadcast.emit('user typing');//, clientSockets[socket.id]);
	});

	socket.on('user done typing', function(){
		console.log("user done typing");
		socket.broadcast.emit('user done typing')
	})

	socket.on('disconnect', function(){
		socket.broadcast.emit('player disconnected', clientSockets[socket.id].participant_name);
		delete clientSockets[socket.id];
	});
});

io.on

http.listen(3000, function(){
	console.log('listening on *:3000');
})

