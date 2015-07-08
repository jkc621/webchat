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
		nickname: ""
	};

	socket.on('player connected', function(nickname){
		clientSockets[socket.id].nickname = nickname;
		var data = {
			id: socket.id,
			nickname: nickname
		};
		socket.broadcast.emit('new member', data);
	});

	socket.on('chat message', function(m){
		var data = {
			id: socket.id,
			nickname: clientSockets[socket.id].nickname ? clientSockets[socket.id].nickname : m.nickname,
			message: m.message
		};
		socket.broadcast.emit('chat message', data);
	});

	socket.on('update players', function(){
		var data = generateCurrentPlayers(clientSockets);
		console.log(data);
		socket.emit('update players reply', data);
	});

	socket.on('user typing', function(){
		socket.broadcast.emit('user typing', clientSockets[socket.id].nickname);
	});

	socket.on('user done typing', function(){
		socket.broadcast.emit('user done typing');
	});

	socket.on('disconnect', function(){
		socket.broadcast.emit('player disconnected', clientSockets[socket.id].nickname);
		delete clientSockets[socket.id];
		var data = generateCurrentPlayers(clientSockets);
		socket.emit('update players reply', data);		 
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});

function generateCurrentPlayers(clientSocketsObject){
	var data = {};
	for(var client in clientSocketsObject){
		data[clientSocketsObject[client].socket.id] = {
			id: clientSocketsObject[client].socket.id,
			nickname: clientSocketsObject[client].nickname
		};
	}
	return data;
}
