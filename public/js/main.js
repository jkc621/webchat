var nickname;
var socket = io();;

$(document).ready(function() {
	socket.on("connect", function(){
		$("#nickname-submit").on("click",function(e){
			e.preventDefault();
			nickname = ($('#nickname').val()).toString();
			console.log(typeof(nickname));
			$('.input-nickname').addClass('hidden');
			socket.emit('player connected', nickname);		
		});
	});
});

$(document).ready(function() {
	$('#submit-button').click(function(e){
		e.preventDefault();
		var payload = {};
		payload.message = $('#message').val();
		payload.nickname = nickname;
		console.log(payload.message);
		socket.emit('chat message', payload);
		$('#m').val('');			
	});

	socket.on('chat message', function(payload){
		var msg = payload.nickname + ": " + payload.message;
		var li = $('<li></li>').text(msg);
		$('#messages').append(li);
	});

	socket.on('new member', function(playerName){
		console.log(playerName);
		var msg = playerName + " just joined this chat.";
		var li = $('<li></li>').addClass("playerJoinedMessage").text(msg);
		$('#messages').append(li);
	})
});

$(document).ready(function() {
	socket.on("player disconnected", function(data){
		var msg = data + " left the chat.";
		var li = $('<li></li>').addClass("playerLeftMessage").text(msg);
		$('#messages').append(li);
	})
});