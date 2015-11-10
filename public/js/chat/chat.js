
var userCurrent = new Object();
if (typeof my_username === 'undefined') {
	userCurrent.userName='';
}else{
	userCurrent.userName=my_username;
}
if (typeof my_token === 'undefined') {
	userCurrent.id='';
}else{
	userCurrent.id=my_token;
}
function send_individual_msg(event,username,room,messages)
{
	if(event.keyCode == 13){
		//alert(id);
		//alert(my_username);
		//socket.emit('check_user', my_username, id);
		$('#'+room+' .msg_body').append('<div class="appChatboxMessage clearfix from-self"><div class="msg_b appChatboxMessage-content">'+messages+'</div></div>');
		$('#'+room+' input').val('');
		var height = 0;
		$('#'+room+' .appChatboxMessage').each(function(i, value){
			height += parseInt($(this).height());
		});

		height += '';

		$('#'+room+' .msg_body').animate({scrollTop: height});
		socket.emit('send', {usersender:my_username, userreceiver:username,room: room, message: messages });
		console.log(username);
	}
}
var classmentorlist = '';
if($('.mentorlist').length != 0){
	classmentorlist = '<div class="msg_tool" onclick="listmentor(this)"><a class="close" >+</a><div class="chatmentor"></div></div>';
}
var socket = io('127.0.0.1:8008');
// on connection to server, ask for user's name with an anonymous callback
socket.on('connect', function(){
	// call the server-side function 'adduser' and send one parameter (value of prompt)
	if(my_username){
		socket.emit('subscribe', my_username);
	}
});
// listener, whenever the server emits 'msg_user_handle', this updates the chat body
socket.on('msg_user_handle', function (data) {
	//console.log('<b>'+username + ':</b> ' + data + '<br>');
	if($('#'+data.room).length > 0){
		$('#'+data.room+' .msg_body').append(
			'<div class="appChatboxMessage clearfix">'+
				'<img class="appChatboxMessage-avatar" alt="'+data.usersender+'" src="">'+
				'<div class="msg_a appChatboxMessage-content">'+data.message+'</div>'+
			'</div>');
		console.log('da12312312sd');
	}else{
		$('#chat-area').append(
			'<div id="'+data.room+'" class="msg_box">'+
			'<div class="msg_head"><div class="msg_title" onclick="showChat()">'+data.usersender+'</div>'+
			'<div class="msg_close msg_tool" onclick="closeChat(\''+data.usersender+'\')">x</div>'+
			classmentorlist+
			'</div>'+
			'<div class="msg_wrap">'+
			'<div class="msg_body">'+
			'<div class="appChatboxMessage clearfix">'+
				'<img class="appChatboxMessage-avatar" alt="'+data.usersender+'" src="">'+
				'<div class="msg_a appChatboxMessage-content">'+data.message+'</div>'+
			'</div>'+
			'<div class="msg_push"></div>'+
			'</div>'+
			'<div class="msg_footer">'+
			'<input chatusers="'+data.room+'" onkeypress="send_individual_msg(event,\''+data.usersender+'\',this.getAttribute(\'chatusers\'),value)" type="text" class="msg_input" rows="1">'+
			'</div>'+
			'</div>'+
			'</div>')
		console.log('dadasdasd');
	}
	var height = 0;
	$('#'+data.room+' .appChatboxMessage').each(function(i, value){
		height += parseInt($(this).height());
	});

	height += '';

});


// listener, whenever the server emits 'updateusers', this updates the username list
socket.on('updatecallcenter', function(data) {
	console.log('updatecallcenter');
	$('#chat_boxid .chat_body').empty();
	$.post(
		'/user/user/loaduserajaxchat?q=c',
		function(rs){
			if(rs.code){
				$.each(rs.data, function(key, value) {
					console.log(value);
					if(userCurrent.userName != value){
						$('#chat_boxid .chat_body').append('<div class="user" style="cursor:pointer;" userchat="'+value+'" onclick="popupchat(this.getAttribute(\'userchat\'))">' + value + '</div>');
					}
				});
			}
		}
	);
});
socket.on('updateexpert', function(data) {
	console.log('updateexpert')
	$('.mentorlist .chat_body').empty();
	$('#chat_boxmentor .chat_body').empty();
	var contentchatbody = '';
	var boxmentorchatbody = '';
	$.post(
		'/user/user/loaduserajaxchat?q=e',
		function(rs){
			if(rs.code){
				console.log(rs.data);
				$.each(rs.data, function(sub, users) {
					contentchatbody += '<h4 class="subject_mentor">'+sub+'</h4>';
					boxmentorchatbody +='<h4 class="subject_mentor">'+sub+'</h4>';
					$.each(users,function(k,v){
						if(userCurrent.userName != v){
							contentchatbody +='<div class="user '+v+'" style="cursor:pointer;" userchat="'+v+'" onclick="updateuserchat(this,\''+v+'\')">' + v + '</div>';
							boxmentorchatbody +='<div class="user" style="cursor:pointer;" userchat="'+v+'" onclick="popupchat(\''+v+'\')">' + v + '</div>'
						}
					})
				});
				$('.mentorlist .chat_body').append(contentchatbody);
				$('#chat_boxmentor .chat_body').append(boxmentorchatbody);
			}
		}
	);
});
socket.on('updateroom',function(data){
	$('#'+data.room).find('.msg_title').append(','+data.username);
})
function popupchat(username){
	//var classmentorlist = '';
	//if($('.mentorlist').length != 0){
	//	classmentorlist = '<div onclick="listmentor(this)"><a class="close" >+</a><div class="chatmentor"></div></div>';
	//}
	room = my_username+username;
			$('#chat-area').append(
				'<div id="'+room+'" class="msg_box">'+
				'<div class="msg_head"><div class="msg_title" onclick="showChat()">'+username+'</div>'+
				classmentorlist+
				'<div class="msg_close" onclick="closeChat(\''+username+'\')">x</div>'+
				'</div>'+
				'<div class="msg_wrap">'+
				'<div class="msg_body">'+
				'<div class="msg_push"></div>'+
				'</div>'+
				'<div class="msg_footer">'+
				'<input chatusers="'+room+'" onkeypress="send_individual_msg(event,\''+username+'\',this.getAttribute(\'chatusers\'),value)" type="text" class="msg_input" rows="1">'+
				'</div>'+
				'</div>'+
				'</div>');
	socket.emit('adduserroom',username,room,'popup');
}

var clonementorlist = $('.mentorlist').clone();
function listmentor(el){
	if($(el).children('.chatmentor').children('.mentorlist').length != 0){
		if($(el).children('.chatmentor').children('.mentorlist').css('display') == 'block'){
			$(el).children('.chatmentor').children('.mentorlist').css('display','none');
		}else{
			$(el).children('.chatmentor').children('.mentorlist').css('display','block');
		}
	}else{
		$(el).children('.chatmentor').append($(clonementorlist).css('display','block'));
	}

}
function updateuserchat(el,usrname){
	var elementRoot = $(el).parent().parent().parent().parent().parent().parent().parent();
	var elementinptmess = $(elementRoot).find('.msg_input');
	var chatusers = $(elementinptmess).attr('chatusers');
	var elementmsgtitle = $(elementRoot).find('.msg_title');
	var userfirst = $(elementmsgtitle).text();
	$(elementmsgtitle).append(','+usrname);
	socket.emit('adduserroom',usrname,chatusers,'mentorlist');
//	$(elementinptmess).attr('chatusers',chatusers+','+usrname);
//console.log($(elementRoot).find('.msg_input').val());
//	console.log(usrname);
}
socket.on('updateroom',function(data){
	$('#'+data.room).find('.'+data.username).css('color','red');
	$('#'+data.room).find('.'+data.username).attr('onclick','leaveroom(\''+data.username+'\',\''+data.room+'\')');
})
socket.on('leaved',function(username,room){
	$('#'+room).find('.'+username).css('color','black');
	$('#'+room).find('.'+username).attr('onclick','updateuserchat(this,\''+username+'\')');
	msg_titlearr = $('#'+room).find('.msg_title').text().split(',');
	$('#'+room).find('.msg_title').text(msg_titlearr[0]);
})
function leaveroom(username,room){
	socket.emit('leaveroom',username,room);
}
function signout(){
	console.log(my_username);
	socket.emit('signout',my_username);
}