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
function send_individual_msg(event, username, room, messages) {
    if (event.keyCode == 13) {
        //alert(id);
        //alert(my_username);
        //socket.emit('check_user', my_username, id);
        $('#' + room + ' .msg_body').append('<div class="appChatboxMessage clearfix from-self"><div class="msg_b appChatboxMessage-content">' + messages + '</div></div>');
        $('#' + room + ' textarea').val('');
        var height = 0;
        $('#' + room + ' .appChatboxMessage').each(function (i, value) {
            height += parseInt($(this).height());
        });

        height += '';
        pushContenttoArray({room: room, usersender: my_username, message: messages});
        $('#' + room + ' .msg_body').animate({scrollTop: height});
        socket.emit('send', {
            usersender: my_username,
            role: my_role,
            userreceiver: username,
            room: room,
            message: messages
        });
        console.log(username);
    }
}
var classmentorlist = '';
if ($('.mentorlist').length != 0) {
    classmentorlist = '<div class="msg_tool" onclick="listmentor(this)"><a class="close" >+</a><div class="chatmentor"></div></div>';
}
//var socket = io('10.20.15.57:8008');
var socket = io('127.0.0.1:8008');
// on connection to server, ask for user's name with an anonymous callback
socket.on('connect', function () {
    // call the server-side function 'adduser' and send one parameter (value of prompt)
    if (my_username) {
        socket.emit('subscribe', my_username, my_role ? my_role : '');
    }
});
// listener, whenever the server emits 'msg_user_handle', this updates the chat body
socket.on('msg_user_handle', function (data) {
    //console.log('<b>'+username + ':</b> ' + data + '<br>');
    contentMesg = '<div class="appChatboxMessage clearfix">' +
        '<img class="appChatboxMessage-avatar" alt="' + data.usersender + '" src="">' +
        '<div class="msg_a appChatboxMessage-content">' + data.message + '</div>' +
        '</div>';
    if (data.imgPath) {
        contentMesg = '<div class="appChatboxMessage clearfix">' +
            '<img class="appChatboxMessage-avatar" alt="' + data.usersender + '" src="">' +
            '<div class="msg_a appChatboxMessage-content"><img onclick="previewImg(\'' + data.imgPath + '\')" src="' + data.imgPath + '"></div>' +
            '</div>';
    }
    if ($('#' + data.room).length > 0) {
        $('#' + data.room + ' .msg_body').append(contentMesg);
    } else {
        $('#chat-area').append(
            '<div id="' + data.room + '" class="msg_box">' +
            '<div class="msg_head"><div class="msg_title" onclick="showChat(\'' + data.room + '\')">' + data.usersender + '</div>' +
            '<div class="msg_close msg_tool" onclick="closeChat(\'' + data.room + '\')">x</div>' +
            classmentorlist +
            '</div>' +
            '<div class="msg_wrap">' +
            '<div class="msg_body">' +
            contentMesg +
            '<div class="msg_push"></div>' +
            '</div>' +
            '<div class="msg_footer">' +
            '<textarea chatusers="' + data.room + '" onkeypress="send_individual_msg(event,\'' + data.usersender + '\',this.getAttribute(\'chatusers\'),value)" placeholder="Send a message..." class="msg_input appChatbox-input" rows="1"></textarea>' +
            '<div class="tool-chat">' +
            '<div class="inputWrapper"><i class="fa fa-camera"></i>' +
            '<input accept="image/*|MIME_type"  onchange="uploadfile(event,this,\'' + data.room + '\',\'' + data.usersender + '\')" class="fileInput"  type="file">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>');
        console.log(data.room);
    }
    var height = 0;
    $('#' + data.room + ' .appChatboxMessage').each(function (i, value) {
        height += parseInt($(this).height());
    });

    height += '';
    pushContenttoArray(data);
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
socket.on('updateexpert', function (data) {
    console.log('updateexpert');
    $('.mentorlist .chat_body').empty();
    $('#chat_boxmentor .chat_body').empty();
    var contentchatbody = '';
    var boxmentorchatbody = '';
    $.post(
        '/user/user/loaduserajaxchat?q=e',
        function (rs) {
            if (rs.code) {
                console.log(rs.data);
                $.each(rs.data, function (sub, users) {
                    contentchatbody += '<h4 class="subject_mentor">' + sub + '</h4>';
                    boxmentorchatbody += '<h4 class="subject_mentor">' + sub + '</h4>';
                    $.each(users, function (k, v) {
                        if (userCurrent.userName != v) {
                            contentchatbody += '<div class="user ' + v + '" style="cursor:pointer;" userchat="' + v + '" onclick="updateuserchat(this,\'' + v + '\')">' + v + '</div>';
                            boxmentorchatbody += '<div class="user" style="cursor:pointer;" userchat="' + v + '" onclick="popupchat(\'' + v + '\')">' + v + '</div>'
                        }
                    })
                });
                $('.mentorlist .chat_body').append(contentchatbody);
                $('#chat_boxmentor .chat_body').append(boxmentorchatbody);
            }
        }
    );
});
socket.on('updateroom', function (data) {
    $('#' + data.room).find('.msg_title').append(',' + data.username);
    pushContenttoArray({room:data.room,usersender: 'system', message: data.userName + ' đã tham gia'})

});
function popupchat(username) {
    //var classmentorlist = '';
    //if($('.mentorlist').length != 0){
    //	classmentorlist = '<div onclick="listmentor(this)"><a class="close" >+</a><div class="chatmentor"></div></div>';
    //}
    room = my_username + '-' + username;
    $('#chat-area').append(
        '<div id="' + room + '" class="msg_box">' +
        '<div class="msg_head"><div class="msg_title" onclick="showChat(\'' + room + '\')">' + username + '</div>' +
        classmentorlist +
        '<div class="msg_close" onclick="closeChat(\'' + room + '\')">x</div>' +
        '</div>' +
        '<div class="msg_wrap">' +
        '<div class="msg_body">' +
        '<div class="msg_push"></div>' +
        '</div>' +
        '<div class="msg_footer">' +
        '<textarea chatusers="' + room + '" onkeypress="send_individual_msg(event,\'' + username + '\',this.getAttribute(\'chatusers\'),value)" placeholder="Send a message..." class="msg_input appChatbox-input" rows="1"></textarea>' +
        '<div class="tool-chat">' +
        '<div class="inputWrapper"><i class="fa fa-camera"></i>' +
        '<input accept="image/*|MIME_type"  onchange="uploadfile(event,this,\'' + room + '\',\'' + username + '\')" class="fileInput"  type="file">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>');
    socket.emit('adduserroom', username, room, 'popup');
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
//	$(elementinptmess).attr('chatusers',chatusers+','+usrname);
//console.log($(elementRoot).find('.msg_input').val());
//	console.log(usrname);
}
//socket.on('updateroom',function(data){
//	$('#'+data.room).find('.'+data.username).css('color','red');
//	$('#'+data.room).find('.'+data.username).attr('onclick','leaveroom(\''+data.username+'\',\''+data.room+'\')');
//});
socket.on('leaved', function (username, room) {
    $('#' + room).find('.' + username).css('color', 'black');
    $('#' + room).find('.' + username).attr('onclick', 'updateuserchat(this,\'' + username + '\')');
    msg_titlearr = $('#' + room).find('.msg_title').text().split(',');
    $('#' + room).find('.msg_title').text(msg_titlearr[0]);
    pushContenttoArray({room:room,usersender: 'system', message: username + ' đã rời khỏi phòng'});
});

socket.on('updatehistories', function (data) {
    contentChat = '';
    if (data.length > 0) {
        data.forEach(function (v, index) {
            pushContenttoArray({
                'room': v.receiver,
                'usersender': v.sender,
                'message': v.msg,
                'imgPath': v.imgPath,
            });
            contentMesg = rendermesg({from: v.sender, mesg: v.msg, imgPath: v.imgPath});
            if ($('#' + v.receiver).length > 0) {
                $('#' + v.receiver + ' .msg_body').append(contentMesg);
            } else {
                $('#chat-area').append(
                    '<div id="' + v.receiver + '" class="msg_box">' +
                    '<div class="msg_head"><div class="msg_title" onclick="showChat(\'' + v.receiver + '\')">' + v.sender + '</div>' +
                    '<div class="msg_close msg_tool" onclick="closeChat(\'' + v.receiver + '\')">x</div>' +
                    classmentorlist +
                    '</div>' +
                    '<div class="msg_wrap">' +
                    '<div class="msg_body">' +
                    contentMesg +
                    '<div class="msg_push"></div>' +
                    '</div>' +
                    '<div class="msg_footer">' +
                    '<textarea chatusers="' + v.receiver + '" onkeypress="send_individual_msg(event,\'' + v.sender + '\',this.getAttribute(\'chatusers\'),value)" placeholder="Send a message..." class="msg_input appChatbox-input" rows="1"></textarea>' +
                    '<div class="tool-chat">' +
                    '<div class="inputWrapper"><i class="fa fa-camera"></i>' +
                    '<input accept="image/*|MIME_type"  onchange="uploadfile(event,this,\'' + v.receiver + '\',\'' + v.sender + '\')" class="fileInput"  type="file">' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>');
                console.log(data.room);
            }
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

function feedback(room) {
    data = {};
    $('#feedbackModal input[type="radio"]:checked').each(function(){
        data[$(this).attr('data-name')] = {
            rating:'',
            comment: '',
            activityId:''
        };
        if($(this).is(':checked')){
            data[$(this).attr('data-name')] = {
                rating:$(this).val(),
                comment: '',
                activityId:$(this).attr('did'),
            }
        }
    });
    $('#feedbackModal textarea').each(function(){
        if(typeof data[$(this).attr('data-name')] != 'undefined'){
            data[$(this).attr('data-name')].comment = $(this).val();
        }
    });
    console.log(data);
    socket.emit('feedback', room, data);
    $('#'+room).remove();
}

function kick(username, room) {
    socket.emit('leaveroom', username, room);
}
function signout() {
    console.log(my_username);
    socket.emit('signout', my_username);
}

function closeChat(room) {
$('#feedbackModal .modal-body').empty();
    $('#feedbackModal .modal-footer').empty();
    //socket.emit('leaveroom',my_username,room);
    if (room.split('-')[1] != 'CallCenter') {
        //$('#' + room).find('.msg_wrap').empty();
        //$('#' + room).find('.msg_wrap').html($('#template-report').html());
        //$('#' + room).find('.btnLeaveroom').attr();
        chat_data['aId'][room].forEach(function (value,index) {
            if(value.userName != my_username){
                if(value.role == 5){
                    $('#template-report .title-feedback').text('Bạn cảm thấy hài lòng với mentor '+value.userName+' này chứ?');
                }
                if(value.role == 10){
                    $('#template-report .title-feedback').text('Bạn cảm thấy hài lòng với callcenter '+value.userName+' này chứ?');
                }
                $('#template-report input').attr('name',value.userName+'-rating');
                $('#template-report input').attr('did',value.activityId);
                $('#template-report input').attr('data-name',value.userName);
                $('#template-report textarea').attr('name',value.userName+'-comment');
                $('#template-report textarea').attr('data-name',value.userName);
                $('#feedbackModal .modal-body').append($('#template-report').html());
            }
        });
        $('#feedbackModal .modal-footer').append('<button type="button" onclick="feedback(\''+room+'\')" class="btn btn-default" data-dismiss="modal">Submit</button>');
        $('#feedbackModal').modal('show');
    } else {
        $('#' + room).remove();
    }
}

function showChat(id) {
    if ($('#' + id).css('position') == 'fixed') {
        $('#' + id).removeAttr('style');
    } else {
        top = $('#' + id).offset().top;
        left = $('#' + id).offset().left;
        $('#' + id).css('position', 'fixed');
        $('#' + id).css('top', top);
        $('#' + id).css('left', left);
        //$('.msg_wrap').slideToggle('slow');
    }
    $('#' + id + ' .msg_wrap').slideToggle('slow');

}

function uploadfile(e, el, room, username) {
    elementRoot = $(el).parent().parent().parent().parent().parent();
    msg_body = $(elementRoot).find('.msg_body');
    allowExtensions = [
        'image/bmp',
        'image/jpeg',
        'image/pjpeg',
        'image/x-jps',
        'image/png',
    ];
    var file = e.target.files[0],
        reader = new FileReader();
    reader.onload = function (evt) {
        if(file.size <= (1048576 * 10) && allowExtensions.indexOf(file.type) >=0){
            $(msg_body).append('' +
                '<div class="appChatboxMessage clearfix from-self">' +
                '<div class="msg_b appChatboxMessage-content"><img src="' + evt.target.result + '"></div>' +
                '</div>');
            $('#imageSelected').attr('src', evt.target.result);
            $('#selectedImageConainer').css('display', '');
            var phoneNum = $('#phoneNumber').val();
            today = new Date();
            stringtoday = String(today.getFullYear()) + String(today.getMonth()) + String(today.getDate());
            console.log(evt);
            console.log(file);
            var jsonObject = {
                'imageData': evt.target.result,
                'imageMetaData': stringtoday,
                'imageType': file.type,
                'imageName': file.name,
                'imageSize': file.size,
                'usersender': my_username,
                'role': my_role,
                'userreceiver': username,
                'room': room,
            };

            // send a custom socket message to server
            socket.emit('user image', jsonObject);
        }else{
            $(msg_body).append('' +
                '<div class="alert center">Bạn chỉ được tải lên các file ảnh dưới 10MB<a class="close" data-dismiss="alert">×</a></div>');
        }
    };
    reader.readAsDataURL(file);
}

socket.on('msg_user_error',function(data){
    $('#'+data.room).find('.msg_body').append('<div class="alert center">'+data.mesg+'<a class="close" data-dismiss="alert">×</a></div>');
});

function previewImg(src) {
    $('#imgModal').modal('show');
    $('#imgModal img').attr('src', src);
    $('#imgModal img').attr('href', src);
}

function rendermesg(data) {
    if (data.from == my_username) {
        if (data.imgPath) {
            return '' +
                '<div class="appChatboxMessage clearfix">' +
                '<div class="msg_b appChatboxMessage-content"><img onclick="previewImg(\'' + data.imgPath + '\')" src="' + data.imgPath + '"></div>' +
                '</div>';
        }
        return '' +
            '<div class="appChatboxMessage clearfix from-self">' +
            '<div class="msg_b appChatboxMessage-content">' + data.mesg + '</div>' +
            '</div>';
    }
    if (data.from == 'system') {
        return '<div class="line-notify">' + data.mesg + '</div>';
    } else {
        if (data.imgPath) {
            return '' +
                '<div class="appChatboxMessage clearfix">' +
                '<img class="appChatboxMessage-avatar" alt="' + data.from + '" src="">' +
                '<div class="msg_a appChatboxMessage-content"><img onclick="previewImg(\'' + data.imgPath + '\')" src="' + data.imgPath + '"></div>' +
                '</div>';
        }
        return '' +
            '<div class="appChatboxMessage clearfix">' +
            '<img class="appChatboxMessage-avatar" alt="' + data.from + '" src="">' +
            '<div class="msg_a appChatboxMessage-content">' + data.mesg + '</div>' +
            '</div>';
    }
}

function pushContenttoArray(data) {
    if (typeof chat_data['contents'][data.room] == 'undefined') {
        chat_data['contents'][data.room] = [];
    }
    chat_data['contents'][data.room].push({from: data.usersender, mesg: data.message, imgPath: data.imgPath});
}