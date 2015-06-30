var nickname;
$(document).ready(function() {
	$("#nickname-submit").on("click",function(e){
		e.preventDefault();
		nickname = $('#nickname').val();
		$('.input-nickname').addClass('hidden');
	})
});

$(document).ready(function() {
	var socket = io();
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
});