var nickname;
var messageDisplay;
var socket = io();

$(document).ready(function() {
	
	messageDisplay = $("#messages");

	socket.on("connect", function(){
		$("#nickname-submit").on("click",function(e){
			e.preventDefault();
			nickname = ($('#nickname').val()).toString();
			$('.input-nickname').addClass('hidden');
			socket.emit('player connected', nickname);		
		});
	});
});

$(document).ready(function() {
	$('#submit-button').click(function(e){
		e.preventDefault();

		//prepare message
		var payload = {};
		payload.message = $('#message').val();
		payload.nickname = nickname;

		//send message
		socket.emit('chat message', payload);

		//display message locally
		var msg = payload.nickname + ": " + payload.message;
		displayMessage(msg, "", messageDisplay);
		
		//clear input box
		$("#message").val('');
	});

	socket.on('chat message', function(payload){
		var msg = payload.nickname + ": " + payload.message;
		displayMessage(msg, "", messageDisplay);
	});

	socket.on('new member', function(playerName){
		console.log(playerName);
		var msg = playerName + " just joined this chat.";
		displayMessage(msg, "playerJoinedMessage", messageDisplay);
	})
});

$(document).ready(function() {
	socket.on("player disconnected", function(data){
		var msg = data + " left the chat.";
		displayMessage(msg, "playerLeftMessage", messageDisplay);
	})
});

function displayMessage(message, cssClass, destination){
	var li = $('<li></li>');
	li.addClass(cssClass).text(message);
	$(destination).append(li);
	console.log($(destination));
}