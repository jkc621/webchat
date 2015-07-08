var messageDisplay;
var notificationDisplay;
var nickname;
var socket;
var typingTimer;
var keyspressed = 0;
var onlinePlayers = {};
var onlinePlayersSize = 0;

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
		clearNotifications();
		$('.input-nickname').addClass('hidden');
		socket.emit('player connected', nickname);
		onlinePlayers[socket.id] = {
			nickname : nickname,
			color: colors[onlinePlayersSize],
			id: socket.id
		};
		socket.emit('update players');
		onlinePlayersSize++; 
	});
});

//send text message
$(document).ready(function() {
	$('#submit-button').click(function(e){
		e.preventDefault();
		clearTimeout(typingTimer);
		alertServerOfEndTyping();
		var payload = {};
		payload.message = $('#message').val();
		payload.nickname = nickname;
		socket.emit('chat message', payload);
		var msg = "me: " + payload.message;
		displayMessage(msg, "", messageDisplay);
		$("#message").val('');
	});
});

//receive update
$(document).ready(function() {
	socket.on('update players reply', function(data){
		console.log(data);
		onlinePlayers = {};
		onlinePlayersSize = 0;
		onlinePlayers[socket.id] = {
			id: socket.id,
			color: colors[onlinePlayersSize],
			nickname: nickname
		};
		onlinePlayersSize++;

		for(var player in data){
			if(!onlinePlayers.hasOwnProperty(data[player].id)){
				onlinePlayers[data[player].id] = {
					id: data[player].id,
					color: colors[onlinePlayersSize],
					nickname: data[player].nickname
				};				
			}
			onlinePlayersSize++;
		}
	});
});

//Receive new player joined chat
$(document).ready(function() {
	socket.on('new member', function(data){
		var msg = data.nickname + " just joined this chat.";
		onlinePlayers[data.id]= {
			nickname: data.nickname,
			id: data.id,
			color: colors[onlinePlayersSize]
		};
		onlinePlayersSize++;
		displayNotification(msg, "playerJoinedMessage");
	});
});

//Receive currently typing and not typing
$(document).ready(function() {
	socket.on('user typing', function(data){
		var msg = data + " is typing.";
		displayNotification(msg);
		setTimeout(clearNotifications, 5000);
	});

	socket.on('user done typing', function(data){
		clearNotifications();
	});
});

//Receive text message
$(document).ready(function(data) {
	socket.on('chat message', function(data){
		var msg, color;
		if(onlinePlayers[data.id]){
			console.log(data.message);
			msg = onlinePlayers[data.id].nickname + ": " + data.message;
			color = onlinePlayers[data.id].color;
		}
		
		displayMessage(msg, "", color);
	});
});

//Receive other player disconnections
$(document).ready(function() {
	socket.on("player disconnected", function(data){
		var msg = data + " left the chat.";
		displayNotification(msg, "playerLeftMessage");
	});
});

//Send events for currently typing and currently not typing
$(document).ready(function() {
	$('#message').keyup(function(e) {
		if (e.keyCode !== 13) {
			clearTimeout(typingTimer);
			typingTimer = setTimeout(alertServerOfEndTyping, 400);
		}		
	});

	$('#message').keydown(function(e) {
		if (e.keyCode !== 13) {
			if (keyspressed === 0) {
			alertServerOfStartTyping();
			}
			clearTimeout(typingTimer);
		}
	});
});

function displayMessage(message, cssClass, color){
	color = color || "rgba(256, 256, 256, 0)";
	var css = {
		"border-left" : "10px solid "+color
	};
	var li = $('<li></li>');
	li.addClass(cssClass).text(message).css(css);	
	$(messageDisplay).append(li);
}

function displayNotification(message, cssClass){
	var div = $('<div></div>');
	var p = $('<p></p>').addClass(cssClass).text(message);
	div.append(p);
	clearNotifications();
	$(notificationDisplay).append(div);
	setTimeout(function(){
		div.addClass('notification');		
	}, 200);
}

function clearNotifications(){
	$('.notification').remove();
}

function alertServerOfStartTyping(){
	socket.emit('user typing');
	keyspressed++;
}

function alertServerOfEndTyping(){
	socket.emit('user done typing');
	keyspressed = 0;
}
