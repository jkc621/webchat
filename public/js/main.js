var messageDisplay;
var notificationDisplay;
var nickname;
// var socket = io();
var socket;
var typingTimer;
var keyspressed = 0;

//initialization
$(document).ready(function() {
	messageDisplay = $("#messages");
	notificationDisplay = $('.notification-bar');
	socket = io();	
});

//send player nickname
$(document).ready(function() {
	$("#nickname-submit").on("click",function(e){
		e.preventDefault();
		nickname = ($('#nickname').val()).toString();
		$('.input-nickname').addClass('hidden');
		socket.emit('player connected', nickname);		
	});
});

//send text message
$(document).ready(function() {
	$('#submit-button').click(function(e){
		e.preventDefault();

		clearTimeout(typingTimer);
		alertServerOfEndTyping();

		//prepare message
		var payload = {};
		payload.message = $('#message').val();
		payload.nickname = nickname;

		//send message
		socket.emit('chat message', payload);

		//display message locally
		var msg = "me: " + payload.message;
		displayMessage(msg, "", messageDisplay);
		
		//clear input box
		$("#message").val('');
	});
});

//new player joined chat
$(document).ready(function() {
	socket.on('new member', function(playerName){
		var msg = playerName + " just joined this chat.";
		displayNotification(msg, "playerJoinedMessage", notificationDisplay);
	})
});

//Receiving new text message
$(document).ready(function() {
	socket.on('chat message', function(payload){
		var msg = payload.nickname + ": " + payload.message;
		displayMessage(msg, "", messageDisplay);
	});
});

//Receive other player disconnections
$(document).ready(function() {
	socket.on("player disconnected", function(data){
		var msg = data + " left the chat.";
		displayNotification(msg, "playerLeftMessage", notificationDisplay);
	})
});

//Send events for currently typing and currently not typing
$(document).ready(function() {
	$('#message').keyup(function(e) {
		if (e.keyCode !== 13) {
			clearTimeout(typingTimer);
			typingTimer = setTimeout(alertServerOfEndTyping, 400);
		};		
	});

	$('#message').keydown(function(e) {
		if (e.keyCode !== 13) {
			if (keyspressed === 0) {
			alertServerOfStartTyping();
			};
			clearTimeout(typingTimer);
		};
	});
});

function displayMessage(message, cssClass, destination){
	var li = $('<li></li>');
	li.addClass(cssClass).text(message);
	$(destination).append(li);
}

function displayNotification(message, cssClass, destination){
	var div = $('<div></div>');
	div.addClass('notification');
	var p = $('<p></p>');
	p.addClass(cssClass).text(message);
	div.append(p);
	$(destination).empty();
	$(destination).append(div);
}

function alertServerOfStartTyping(){
	socket.emit('user typing');
	keyspressed++;
}

function alertServerOfEndTyping(){
	socket.emit('user done typing');
	keyspressed = 0
}
