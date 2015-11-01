var userCurrent = new Object();
userCurrent.userName=my_username;
userCurrent.id=my_token;
function send_individual_msg(event,username,messages)
{
	if(event.keyCode == 13){
		//alert(id);
		//alert(my_username);
		//socket.emit('check_user', my_username, id);
		$('#'+username+' .msg_body').append('<div class="msg_b">'+messages+'</div>');
		$('#'+username+' input').val('');
		socket.emit('msg_user', username, my_username, messages);
	}
}
var socket = io.connect('127.0.0.1:8008');
// on connection to server, ask for user's name with an anonymous callback
socket.on('connect', function(){
	// call the server-side function 'adduser' and send one parameter (value of prompt)
	socket.emit('adduser', userCurrent);
});
// listener, whenever the server emits 'msg_user_handle', this updates the chat body
socket.on('msg_user_handle', function (userSender, data) {
	//console.log('<b>'+username + ':</b> ' + data + '<br>');
	if($('#'+userSender).length > 0){
		$('#'+userSender+' .msg_body').append('<div class="msg_a">'+data+'</div>');
	}else{
		$('#chat-area').append(

			'<div id="'+userSender+'" class="msg_box">'+
			'<div class="msg_head" onclick="showChat()">'+userSender+
			'<div class="close" onclick="closeChat(\''+userSender+'\')">x</div>'+
			'</div>'+
			'<div class="msg_wrap" >'+
			'<div class="msg_body">'+'<div class="msg_chat_a">'+
			'<div class="msg_a">' + ''+data+'</div>'+
			'</div>'+
			'<div class="msg_push"></div>'+
				//'<img src="public/tp/v1/images/avatar-default.png">'+
			'</div>'+
			'<div class="msg_footer">'+
			'<input onkeypress="send_individual_msg(event,\''+userSender+'\',value)" type="text" class="msg_input" rows="1" style="height:30px;">'+
			'</div>'+
			'</div>'+
			'</div>')
	}
});

// listener, whenever the server emits 'msg_user_found'
socket.on('msg_user_found', function (username) {
	//alert(username);
	//console.log(username);
	socket.emit('msg_user', username, my_username, prompt("Type your message:"));
});
// listener, whenever the server emits 'updatechat', this updates the chat body
socket.on('updatechat', function (username, data) {
	//$('#conversation').append('<b>'+username + ':</b> ' + data + '<br>');
});

// listener, whenever the server emits 'store_username', this updates the username
socket.on('store_username', function (username) {
	user = username;
});
// listener, whenever the server emits 'updateusers', this updates the username list
socket.on('updateusers', function(data) {
	//alert(data);
	//console.log(data);
	$('.chat_body').empty();
	$.each(data, function(key, value) {
		if(userCurrent.userName == key){
			userCurrent.id = value;
		}
		if(userCurrent.userName != key){
			$('.chat_body').append('<div class="user" style="cursor:pointer;" onclick="popupchat(\''+key+'\')">' + key + '</div>');
		}
	});
});
function popupchat(username){
	//var count = $('.msg_box').length()
		if($('#'+username).length==0){
			$('#chat-area').append(
				'<div id="'+username+'" class="msg_box">'+
				'<div class="msg_head" onclick="showChat()">'+username+
				//'<div class="msg_head" onclick="showChat(\''+username+'\')">'+username+
				'<div class="close" onclick="closeChat(\''+username+'\')">x</div>'+
				'</div>'+
				'<div class="msg_wrap">'+
				'<div class="msg_body">'+
				'<div class="msg_push"></div>'+
				'</div>'+
				'<div class="msg_footer">'+
				'<input placeholder="Send a message..." onkeypress="send_individual_msg(event,\''+username+'\',value)" type="text" class="msg_input" rows="1" style="height:30px;">'+
				'</div>'+
				'</div>'+
				'</div>')
		}

}
// on load of page
//$(function(){
//	// when the client clicks SEND
//	$('#datasend').click( function() {
//		var message = $('#data').val();
//		if(message == '' || jQuery.trim(message).length == 0)
//			return false;
//		$('#data').val('');
//		// tell server to execute 'sendchat' and send along one parameter
//		socket.emit('sendchat', message);
//	});
//	// when the client hits ENTER on their keyboard
//	$('#data').keypress(function(e) {
//		if(e.which == 13) {
//			$(this).blur();
//			//$('#datasend').focus().click();
//			$('#datasend').click();
//		}
//	});
//});