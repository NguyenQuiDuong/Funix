var userCurrent = {};
if (typeof my_username === 'undefined') {
    userCurrent.userName = '';
} else {
    userCurrent.userName = my_username;
}
if (typeof my_token === 'undefined') {
    userCurrent.id = '';
} else {
    userCurrent.id = my_token;
}
var isRead = false;
function send_individual_msg(event, username, room, messages) {
    if (event.keyCode == 13) {
        $('#chatwindow .today-chats').append('' +
            '<div class="line-chat supporter_chat_dash"> ' +
            '<p class="s_name"> <strong> ' + my_username + ' </strong> </p> ' +
            '<div class="msg-container"> ' +
            '<div class="d-msg"> ' + messages + ' </div> ' +
            '<span class="datetime"></span> ' +
            '</div> ' +
            '</div>');
        $('#content_message').val('');
        pushContenttoArray({room: room, usersender: my_username, message: messages});
        socket.emit('send', {
            usersender: my_username,
            role: my_role,
            userreceiver: username,
            room: room,
            message: messages,
            avatar:my_avatar,
        });
    }
}

var classmentorlist = '';
if ($('.mentorlist').length != 0) {
    classmentorlist = '<div class="msg_tool" onclick="listmentor(this)"><a class="close" >+</a><div class="chatmentor"></div></div>';
}
var url = window.location.hostname;
var socket = io(url+':8008');

// on connection to server, ask for user's name with an anonymous callback
socket.on('connect', function () {
    if (my_username) {
        socket.emit('subscribe', my_username, my_role ? my_role : '');
    }
});

socket.on('updatevisitors', function (users) {
    $.each(users, function (index, user) {
        if ($('#' + user.username).length == 0) {
            type = '';
            if (user.role == 5) {
                type = 'Mentor';
            }
            if (user.role == 200) {
                type = 'Student'
            }
            $('#tbl_visitor').find('tbody').append(
                '<tr id="' + user.username + '" class="open_windows" onclick="popupchat(\'' + user.username + '-' + my_username + '\',\'' + 'adduser' + '\')" style="cursor:pointer;"> ' +
                '<td class="clumn1">' +
                '<i class="icon-user"></i>' +
                '</td> ' +
                '<td class="clumn2">' +
                '<a href="javascript:void(0)">' + user.username + '</a>' +
                '</td> ' +
                '<td class="">' +
                '<i class="flag-all flag-vn"></i>' +
                '</td> ' +
                '<td class=""></td> ' +
                '<td class="">Funix</td>' +
                '<td>' + type + '</td>' +
                '<td class="agent" title=""></td>' +
                '</tr>'
            )
        }
    })

});

// listener, whenever the server emits 'msg_user_handle', this updates the chat body
socket.on('msg_user_handle', function (data) {
    $.playSound('/audio/alert');
    if ($('#footer').css('display') != 'block') {
        $('#chat-compressed .chat-button').empty();
        if ($('#li_' + data.room).length == 0) {
            $('#chat-compressed .chat-button').append('' +
                '<li id="li_' + data.room + '" style="width: 50%;" class="unread">' +
                '<a class="open_windows" id="' + data.usersender + '" href="javascript:popupchat(\'' + data.room + '\');">' +
                '<i id="status_' + data.usersender + '" class="i-con-tab i-away"></i>' + data.usersender +
                '</a>' +
                '<i class="close-button-chat" id="' + data.usersender + '"></i>' +
                '</li>');
        }
        $('#footer').css('display', 'block');
    }
    if ($('#footer').css('display') == 'block') {
        if ($('#li_' + data.room).length == 0) {
            $('#chat-compressed .chat-button').append('' +
                '<li id="li_' + data.room + '" style="width: 50%;" class="unread">' +
                '<a class="open_windows" id="' + data.usersender + '" href="javascript:popupchat(\'' + data.room + '\');">' +
                '<i id="status_' + data.usersender + '" class="i-con-tab i-away"></i>' + data.usersender +
                '</a>' +
                '<i class="close-button-chat" id="' + data.usersender + '"></i>' +
                '</li>');
        }
    }
    $('#li_' + data.room).addClass('unread');
    pushContenttoArray(data);

    if ($('#chatwindow').html()) {
        if (data.imgPath) {
            $('#chatwindow .today-chats').append('' +
                '<div class="line-chat visitor_chat_dash"> ' +
                '<p class="s_name"><strong>' + data.usersender + '</strong></p> ' +
                '<div class="msg-container"> ' +
                '<div class="d-msg"><img style="height: 150px;" src="' + data.imgPath + '"></div> ' +
                '<span class="datetime"></span> ' +
                '</div> ' +
                '</div>'
            );
        } else {
            $('#chatwindow .today-chats').append('' +
                '<div class="line-chat visitor_chat_dash"> ' +
                '<p class="s_name"><strong>' + data.usersender + '</strong></p> ' +
                '<div class="msg-container"> ' +
                '<div class="d-msg"> ' + data.message + '</div> ' +
                '<span class="datetime"></span> ' +
                '</div> ' +
                '</div>'
            );
        }

    }
    autoscroll(data.room);

});


// listener, whenever the server emits 'updateusers', this updates the username list
//socket.on('updatecallcenter', function(data) {
//	console.log('updatecallcenter');
//	$('#chat_boxid .chat_body').empty();
//	$.post(
//		'/user/user/loaduserajaxchat?q=c',
//		function(rs){
//			if(rs.code){
//				$.each(rs.data, function(key, value) {
//					console.log(value);
//					if(userCurrent.userName != value){
//						$('#chat_boxid .chat_body').append('<div class="user" style="cursor:pointer;" userchat="'+value+'" onclick="popupchat(this.getAttribute(\'userchat\'))">' + value + '</div>');
//					}
//				});
//			}
//		}
//	);
//});

socket.on('updateroom', function (data) {
    $('#' + data.room).find('.msg_title').append(',' + data.username);
    $('#chatwindow .today-chats').append('<div class="line-notify">' + data.username + ' đã tham gia</div>');
    pushContenttoArray({usersender: 'system', message: data.userName + ' đã tham gia'})
});

socket.on('updatehistories', function (data) {
    contentChat = '';
    if (data.length > 0) {
        if ($('#footer').css('display') != 'block') {
            $('#chat-compressed .chat-button').empty();
            $('#footer').css('display', 'block');
        }
        data.forEach(function (v, index) {
            pushContenttoArray({
                'room': v.receiver,
                'usersender': v.sender,
                'message': v.msg,
                'imgPath': v.imgPath,
            });
            contentMesg = rendermesg({from: v.sender, mesg: v.msg, imgPath: v.imgPath});

            if ($('#li_' + v.receiver).length == 0) {
                $('#chat-compressed .chat-button').append('' +
                    '<li id="li_' + v.receiver + '" style="width: 50%;" class="unread">' +
                    '<a class="open_windows" id="' + v.sender + '" href="javascript:popupchat(\'' + v.receiver + '\');">' +
                    '<i id="status_' + v.sender + '" class="i-con-tab i-away"></i>' + v.sender +
                    '</a>' +
                    '<i class="close-button-chat" id="' + v.sender + '"></i>' +
                    '</li>');
            }
            autoscroll(v.receiver);
        });
    }
});
socket.on('updatechatactivityid',function(data){
    if(typeof chat_data['aId'][data.room] == 'undefined'){
        chat_data['aId'][data.room] = [];
    }
    chat_data['aId'][data.room].push({activityId: data.activityId,userName:data.userName,role:data.role});
});
socket.on('loadchatactivity',function(data){
    data.forEach(function(value,index){
        if(typeof chat_data['aId'][value.room] == 'undefined'){
            chat_data['aId'][value.room] = [];
        }
        chat_data['aId'][value.room].push({activityId: value.activityId,userName:value.userName,role:value.role});
    });
});
function popupchat(room, option) {
    var nameuserinroom = "";
    var contenthtmlmesg = "";
    $('#li_'+room).removeClass('unread');
    contentsChat = chat_data['contents'];
    if (typeof contentsChat[room] != 'undefined') {
        for (i = 0; i < contentsChat[room].length; i++) {
            name = contentsChat[room][i].from;
            if (nameuserinroom.indexOf(name) == -1) {
                if(name != my_username){
                    if (nameuserinroom.length == 0) {
                        nameuserinroom += name;
                    } else {
                        nameuserinroom += ',' + name;
                    }
                }
            }
            contenthtmlmesg += rendermesg(contentsChat[room][i]);
        }
    } else {
        if (option == 'adduser') {
            nameuserinroom = room.split('-')[0];
            socket.emit('adduserroom', nameuserinroom, room, 'popup');
        }
    }

    //if (option == 'adduser'){
    //	nameuserinroom = room.split('-')[0];
    //	socket.emit('adduserroom',nameuserinroom,room,'popup');
    //}else{
    //	if(typeof chat_data[room] != 'undefined'){
    //		for(i=0;i<chat_data[room].length;i++){
    //			name = chat_data[room][i].from;
    //			if(nameuserinroom.indexOf(name) == -1){
    //				if(nameuserinroom.split(',').length == 1){
    //					nameuserinroom += name;
    //				}else{
    //					nameuserinroom += ','+name;
    //				}
    //			}
    //			contenthtmlmesg += rendermesg(chat_data[room][i]);
    //		}
    //	}else{
    //		nameuserinroom = room.split('-')[0];
    //	}
    //
    //}
    $('#chatwindow').empty();
    $('#chatwindow').attr('room', room);
    var htmlchatwindow = $('#template-chatwindow').html();
    $('#chatwindow').append(htmlchatwindow);
    $('#chatwindow #chat-name').append(' <i id="status_icon_chat" class="icon-wd icon-wd-away imgchatwindow"></i><strong>' + nameuserinroom + '</strong>');
    $('#chatwindow #username').text(nameuserinroom);
    $('#chatwindow .today-chats').html(contenthtmlmesg);
    $('#chatwindow #minimize').attr('href', "javascript:minimizechatwindow('" + room + "')");
    $('#closechat').attr('onclick', "leaveroom('" + my_username + "','" + room + "')");
    $('#content_message').attr('chatusers', room);
    $('#content_message').attr('onkeypress', "send_individual_msg(event,'" + my_username + "',this.getAttribute('chatusers'),value)");
    $('#chatwindow').css('display', 'block');
    $('#chatwindow').css('margin-left', '-517px');


}

var clonementorlist = $('.mentorlist').clone();
function listmentor(el) {
    if ($(el).children('.chatmentor').children('.mentorlist').length != 0) {
        if ($(el).children('.chatmentor').children('.mentorlist').css('display') == 'block') {
            $(el).children('.chatmentor').children('.mentorlist').css('display', 'none');
        } else {
            $(el).children('.chatmentor').children('.mentorlist').css('display', 'block');
        }
    } else {
        $(el).children('.chatmentor').append($(clonementorlist).css('display', 'block'));
    }

}
function updateuserchat(el, usrname) {
    var elementRoot = $(el).parent().parent().parent().parent().parent().parent().parent();
    var elementinptmess = $(elementRoot).find('.msg_input');
    var chatusers = $(elementinptmess).attr('chatusers');
    var elementmsgtitle = $(elementRoot).find('.msg_title');
    var userfirst = $(elementmsgtitle).text();
    $(elementmsgtitle).append(',' + usrname);
    socket.emit('adduserroom', usrname, chatusers, 'mentorlist');
}
socket.on('updateroom', function (data) {
    $('#' + data.room).find('.' + data.username).css('color', 'red');
    $('#' + data.room).find('.' + data.username).attr('onclick', 'leaveroom(\'' + data.username + '\',\'' + data.room + '\')');
});
socket.on('leaved', function (username, room) {
    pushContenttoArray({usersender: 'system', message: username + ' đã rời khỏi phòng'});
    $('#chatwindow .today-chats').append('<div class="line-notify">' + username + ' đã rời khỏi phòng</div>');
});
function leaveroom(username, room) {
    c =confirm('Bạn muốn thoát khỏi cuộc trò chuyện này ?');
    if(c){
        if ($('#chatwindow').html() != '') {
            $('#chatwindow').empty();
            $('#chatwindow').css('display', 'none');
        }
        if ($('#li_' + room).length > 0) {
            $('#li_' + room).remove();
        }
        socket.emit('leaveroom', username, room);
    }
}
function signout() {
    console.log(my_username);
    socket.emit('signout', my_username);
}

function rendermesg(data) {
    if (data.from == my_username) {
        return '' +
            '<div class="line-chat supporter_chat_dash"> ' +
            '<p class="s_name"> <strong> ' + data.from + ' </strong> </p> ' +
            '<div class="msg-container">' +
            ' <div class="d-msg"> ' + data.mesg + ' </div> ' +
            '<span class="datetime"></span> ' +
            '</div> ' +
            '</div>'
    }
    if (data.from == 'system') {
        return '<div class="line-notify">' + data.mesg + '</div>'
    }
    if (data.imgPath) {
        return '' +
            '<div class="line-chat supporter_chat_dash"> ' +
            '<p class="s_name"> <strong> ' + data.from + ' </strong> </p> ' +
            '<div class="msg-container">' +
            '<div class="d-msg"><img style="height: 150px;" src="' + data.imgPath + '"></div> ' +
            '<span class="datetime"></span> ' +
            '</div> ' +
            '</div>'
    } else {
        return '' +
            '<div class="line-chat visitor_chat_dash"> ' +
            '<p class="s_name"><strong>' + data.from + '</strong></p> ' +
            '<div class="msg-container"> ' +
            '<div class="d-msg"> ' + data.mesg + '</div> ' +
            '<span class="datetime"></span> ' +
            '</div> ' +
            '</div>'
    }
}

function minimizechatwindow(room) {
    if ($('#chatwindow').html() != '') {
        $('#chatwindow').empty();
        $('#chatwindow').css('display', 'none');
    }
    if ($('#footer').css('display') == 'none') {
        $('#footer').css('display', 'block');
    }
    if ($('#li_' + room).length == 0) {
        $('#chat-compressed .chat-button').append('<li id="li_' + room + '" style="width: 50%;" class="unread"><a class="open_windows" id="' + room.split('-')[0] + '" href="javascript:popupchat(\'' + room + '\');"><i id="status_' + room.split('-')[0] + '" class="i-con-tab i-away"></i>' + room.split('-')[0] + '</a><i class="close-button-chat" id="' + room.split('-')[0] + '"></i></li>')
    }
}

function pushContenttoArray(data) {
    if (typeof chat_data['contents'][data.room] == 'undefined') {
        chat_data['contents'][data.room] = [];
    }
    chat_data['contents'][data.room].push({from: data.usersender, mesg: data.message, imgPath: data.imgPath});
}

function actionchatwindow(element) {
    select = $(element).val();
    var boxmentorchatbody = '';
    switch (select) {
        case 'transfer':
            $.post(
                '/user/user/loaduserajaxchat?q=e',
                function (rs) {
                    if (rs.code == 1) {
                        console.log(rs.data);
                        $.each(rs.data, function (sub, users) {
                            boxmentorchatbody += '<h4 class="subject_mentor">' + sub + '</h4>';
                            $.each(users, function (k, v) {
                                if (userCurrent.userName != v) {
                                    boxmentorchatbody += '<div class="user" style="cursor:pointer;" userchat="' + v + '" onclick="addusertoroom(\'' + v + '\')">' + v + '</div>'
                                }
                            })
                        });
                        $('#list-mentor').empty();
                        $('#list-mentor').append(boxmentorchatbody);
                    }
                    if (rs.code == 2) {
                        $('#list-mentor').empty();
                        $('#list-mentor').append('<h4 class="subject_mentor">Không có mentor online</h4>');
                        $('#list-mentor').append('<div class="user" style="cursor:pointer;" onclick="addusertoroom()">Quay trở lại</div>');
                    }
                }
            );
            $('#list-mentor').css('display', 'block');
            $('#chatwindow .conversion').css('display', 'none');
            $('#chatwindow .type_message').css('display', 'none');
            break;
    }
}

function addusertoroom(username) {
    $('#list-mentor').css('display', 'none');
    $('#chatwindow .conversion').css('display', 'block');
    $('#chatwindow .type_message').css('display', 'block');
    room = $('#chatwindow').attr('room');
    var check = true;
    chat_data['aId'][room].forEach(function (value,index) {
        if(value.userName == username){
            check = false;
        }
    });
    if (check == false){
        alert('Đã có người này trong phòng');
    }
    if (check ==true && username) {
        socket.emit('adduserroom', username, $('#chatwindow').attr('room'), 'mentorlist');
    }
    $('#chatwindow .op-search').val(1);

}

function autoscroll(room){
    var objDiv = $('#chatwindow').find('.today-chats')[0];
    if(typeof objDiv != 'undefined'){
        objDiv.scrollTop = objDiv.scrollHeight;
    }
}