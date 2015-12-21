var express = require('express');
var app = express();
var io = require('socket.io')();
io.listen(8008);
var fs = require('fs');
var mongoose = require('mongoose');
var mysql = require('mysql');
var path = require("path");
var mime = require('mime');
// app.listen(8008);

// routing
//app.get('/', function (req, res) {
//  res.sendfile(__dirname + '/chat.html');
//});
ROOT_FOLDER = path.join(__dirname, '../');
var PUBLIC_FOLDER = path.join(ROOT_FOLDER, '/public');
var MEDIA_FOLDER = path.join(PUBLIC_FOLDER, '/media');
var CHAT_FOLDER = path.join(MEDIA_FOLDER, '/chat');
var ROLE_MENTOR = 5;
var ROLE_CALLCENTER = 10;
var ROLE_STUDENT = 200;
var ARRAY_ROLE = [];
    ARRAY_ROLE[5] = 'mentor';
    ARRAY_ROLE[10] = 'callCenter';
    ARRAY_ROLE[200] = 'student';
var FILE_ALLOW = {
    size:1048576 * 10,
    type:[
        'image/bmp',
        'image/jpeg',
        'image/pjpeg',
        'image/x-jps',
        'image/png',
    ]
}
var dbmysql = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'mentor'
});
mongoose.connect('mongodb://127.0.0.1/chat', function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to mongodb!');
    }
});

dbmysql.connect(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to mysql');
    }
});

var messageSchema = mongoose.Schema({
    sender: String,
    avatar:String,
    receiver: String,
    msg: String,
    imgPath: String,
    created: {type: Date, default: Date.now}
});

var userSchema = mongoose.Schema({
    userid: String,
    username: String,
    role: String,
    status: Boolean,
    lastaccess: {type: Date, default: Date.now}
});

var callcenterSchema = mongoose.Schema({
    userId: String,
    userName: String,
    count: Number,
    status: Boolean,
    lastaccess: {type: Date, default: Date.now}
});

var roomSchema = mongoose.Schema({
    room: String,
    userName: String,
    roomId: String,
    status: {type: Boolean, default: true},
    createdDate: {type: Date, default: Date.now}
});

var Message = mongoose.model('Message', messageSchema);
var User;
User = mongoose.model('User', userSchema);
var CallCenter = mongoose.model('CallCenter', callcenterSchema);
var Room = mongoose.model('Room', roomSchema);

// usernames which are currently connected to the chat
var usernames = [];
var sockets = [];
var callcenterRoom = [];
var datahistory = [];
Date.prototype.toMysqlFormat = function (type) {
    function pad(n) {
        return n < 10 ? '0' + n : n
    }

    if (type == 'DateTime') {
        return this.getFullYear() + "-" + pad(1 + this.getMonth()) + "-" + pad(this.getDate()) + " " + pad(this.getHours()) + ":" + pad(this.getMinutes()) + ":" + pad(this.getSeconds());
    } else {
        return this.getFullYear() + "-" + pad(1 + this.getMonth()) + "-" + pad(this.getDate());
    }
};
/**
 *
 * @param dataString
 * @returns {*}
 */
//TODO: function to decode base64 to binary
function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};
    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    return response;
}
/**
 *
 * @param activity
 * @param callback
 */
function createActivity(activity, callback) {
    dbmysql.query('INSERT INTO chat_activities SET ?', activity, function (err, res) {
        if (err) throw err;
        callback(res);
    })
}

/**
 *
 * @param activity
 * @param callback
 */
function updateActivity(activity,callback){
    if (activity.student && activity.rating && activity.note){
        console.log(activity);
        dbmysql.query('UPDATE chat_activities SET endedDate = ?, endedDateTime = ? ,rating = ?,note = ? WHERE id = ? ',
            [
                new Date().toMysqlFormat(),
                new Date().toMysqlFormat('DateTime'),
                activity.rating,
                activity.note,
                activity.id
            ],
            function (err, rows) {
            if (err) throw err;
            callback(rows);
        })
    }
}
/**
 * @param status
 * @param username
 * @constructor
 */
function ChangeStatusUserMysql(status, username) {

    dbmysql.query('SELECT * FROM users WHERE username = ?', [username], function (err, result) {
        if (result) {
            dbmysql.query('UPDATE users SET status = ? WHERE username = ?', [status, username], function (err, result) {
                if (err) {
                    console.log(err)
                } else {
                    if (status == "1") {
                        console.log('Doi trang thai cua ' + username + ' sang online thanh cong');
                    }
                    if (status == "2") {
                        console.log('Doi trang thai cua ' + username + ' sang offline thanh cong');
                    }
                }
            });
        }
    });
}

/**
 *
 * @param userId
 * @param username
 * @param role
 * @param status
 * @param lastaccess
 * @param callback
 * @returns {boolean}
 */
function updateUserMongoDb(userId, username, role, status, lastaccess, callback) {
    if (username == null || role == null || status == null || role == ROLE_CALLCENTER) {
        console.log('Du lieu sai');
        return false;
    }
    dataupdate = {};
    if(status){
        dataupdate.status = status;
    }
    if(lastaccess){
        dataupdate.lastaccess = lastaccess;
    }
    //dataupdate = {status: status, lastaccess: lastaccess};
    if (userId) {
        dataupdate.userid = userId;
    }
    queryUser = '';
    queryUser = User.find({username: username});
    queryUser.exec(function (err, result) {
        if (err) throw err;
        if (result.length != 0) {
            User.update(
                {username: username},
                {$set: dataupdate},
                {w: 1},
                function (err) {
                    if (err)throw err;
                    console.log('lastaccess updated at ' + lastaccess);
                    callback(lastaccess)
                }
            )
        }
        if (result.length == 0) {
            var user = new User({
                userid: userId,
                username: username,
                role: role,
                status: status,
                lastaccess: lastaccess
            });
            user.save(function (err) {
                if (err) {
                    console.log(err);
                    callback(user);
                }
            })
        }
    })
}
/**
 *
 * @param username
 * @param userId
 * @param callback
 */
function getCallCenterMongodb(username, userId, callback) {
    queryCallcenter = '';
    datatofind = {};
    if (username) {
        datatofind.userName = username;
    }
    if (userId) {
        datatofind.userId = userId;
    }
    queryCallcenter = CallCenter.find(datatofind).sort({
        "count": 1
    }).limit(1);
    callcenter = '';
    queryCallcenter.exec(function (err, cc) {
        if (err) throw  err;
        if (cc) {
            cc.forEach(function (el, index) {
                callcenter = el;
            });
            callback(callcenter);
        } else {
            callback(false);
        }
    });
}
/**
 *
 * @param userId
 * @param userName
 * @param callback
 */
function getUserMongodb(userId, userName, callback) {
    queryUser = '';
    datatofind = {};
    if (userId) {
        datatofind.userid = userId;
    }
    if (userName) {
        datatofind.username = userName;
    }
    queryUser = User.find(datatofind);
    queryUser.exec(function (err, result) {
        if (err) throw err;
        if (result) {
            if (result.length == 1) {
                callback(result[0]);
            } else {
                callback(false);
            }
        }
    })
}
/**
 *
 * @param callback
 */
function fetchUserOnline(callback) {
    queryUser = '';
    arrayUser = [];
    queryUser = User.find({status: true});
    queryUser.exec(function (err, result) {
        if (err) throw err;
        if (result) {
            result.forEach(function (el, index) {
                arrayUser.push(el);
            });
            callback(arrayUser);
        }
    })
}
/**
 *
 * @param sender
 * @param receiver
 * @param time
 * @param callback
 */
function fetchHistoryMessages(sender, receiver, time, callback) {
    queryMessages = '';
    datatofind = {};

    if (sender) {
        datatofind.sender = sender;
    }
    if (receiver) {
        datatofind.receiver = receiver;
    }
    if (time) {
        datatofind.created = {
            $gte: time.from,
            $lt: time.to,
        };
    }

    queryMessages = Message.find(datatofind);
    queryMessages.exec(function (err, result) {
        if (err) throw err;
        if (result) {
            callback(result);
        }
    })
}
/**
 *
 * @param roomName
 * @param userName
 * @param roomId
 * @param callback
 */
function createRoomMongoose(roomName, userName, roomId, callback) {
    var room = Room({
        room: roomName,
        userName: userName,
        roomId: roomId,
    });
    room.save(function (err,rs) {
        if (err) throw err;
        callback(rs);
    });
}
/**
 *
 * @param room
 * @param userName
 * @param roomId
 * @param status
 * @param callback
 */
function getRoomMongoose(room, userName, roomId,status, callback) {
    queryRoom = '';
    datatofind = {};
    if (room) {
        datatofind.room = room;
    }
    if (userName) {
        datatofind.userName = userName;
    }
    if (roomId) {
        datatofind.roomId = roomId;
    }
    if(status){
        datatofind.status = status;
    }
    queryRoom = Room.find(datatofind);
    queryRoom.exec(function (err, result) {
        if (err) throw err;
        if (result.length != 0) {
            callback(result);
        } else {
            callback(false);
        }
    })
}
/**
 *
 * @param roomId
 * @param roomName
 * @param userName
 * @param status
 * @param callback
 */
function updateStatusRoomMongoose(roomId,roomName,userName,status,callback){
    queryRoom = '';
    datatofind = {};
    if (roomId) {
        datatofind.roomId = roomId;
    }
    if (userName) {
        datatofind.userName = userName;
    }
    if (roomId) {
        datatofind.room = roomName;
    }
    queryRoom = Room.find(datatofind).limit(1);
    queryRoom.exec(function(err,result){
        if(err) throw err;
        if(result.length >0){
            Room.update(
                datatofind,
                {$set: {status:status}},
                {w: 1},
                function (err) {
                    if (err)throw err;
                    callback(result)
                }
            )
        }
    })

}
/**
 *
 * @param room
 * @param userName
 * @param roomId
 * @param callback
 */
function deleteRoomMongoose(room, userName, roomId, callback) {
    queryRoom = '';
    datatofind = {};
    if (room) {
        datatofind.room = room;
    }
    if (userName) {
        datatofind.userName = userName;
    }
    if (roomId) {
        datatofind.roomId = roomId;
    }
    queryRoom = Room.find(datatofind).remove();
    queryRoom.exec(function (err) {
        if (err) {
            throw err;
            callback(false);
        }
        callback(true);
        console.log("da remove");
    })
}
/**
 *
 * @param message
 * @param callback
 */
function saveMesgMongoose(message, callback) {
    var newMsg = new Message(message);
    newMsg.save(function (err, msg) {
        if (err) throw err;
        if (msg) {
            findMsg = Message.find({id: msg.id});
            findMsg.exec(function (err, result) {
                callback(result);
            })
        }
    });

}

io.sockets.on('connection', function (socket) {
    socket.on('subscribe', function (username, role) {
        //save status to mysql
        ChangeStatusUserMysql("1", username);
        /* ======Load log chat ======== */
        getRoomMongoose('', username, '',true, function (r) {
            if (r) {
                today = new Date();
                //today.setDate();
                today.setHours(0);
                today.setMinutes(0);
                today.setSeconds(0);
                today.setMilliseconds(0);
                tommorow = new Date();
                tommorow.setDate(today.getDate() + 1);
                r.forEach(function (v, index) {
                    socket.join(v.room);
                    console.log(username + 'da vao lai room ' + v.room);
                    time = {
                        from: today.toISOString(),
                        to: tommorow.toISOString()
                    };
                    fetchHistoryMessages(null, v.room, time, function (histories) {
                        socket.emit('updatehistories', histories);
                    });
                    data = new Array();
                    getRoomMongoose(v.room,'','','',function(rs){
                        rs.forEach(function(value,index){
                            getUserMongodb('',value.userName,function(u){
                                if(u){
                                    socket.emit('updatechatactivityid',{
                                        'userName': value.userName,
                                        'activityId': value.roomId,
                                        'role': u.role,
                                        'room': v.room,
                                    });
                                }else{
                                    getCallCenterMongodb(value.userName,'',function(cu){
                                        if(cu){
                                            socket.emit('updatechatactivityid',{
                                                'userName': value.userName,
                                                'activityId': value.roomId,
                                                'role': ROLE_CALLCENTER,
                                                'room': v.room,
                                            });
                                        }
                                    });
                                    //console.log();
                                };
                                //socket.emit('loadchatactivity',data);
                            });
                            //console.log(data);
                        });
                    });
                });
            }
        });
        /* ======End load log chat======= */

        if (role == ROLE_CALLCENTER) {
            var querygetCallCenter = CallCenter.find({userName: username});
            querygetCallCenter.exec(function (err, result) {
                if (err) {
                    throw err;
                } else {
                    if (result.length > 0) {
                        CallCenter.update(
                            {userName: username},
                            {$set: {userId: socket.id, status: true, lastaccess: Date.now()}},
                            {w: 1},
                            function (err) {
                                if (err) throw err;
                                console.log('update callcenter user success');
                            }
                        )
                    } else {
                        var callcenter = new CallCenter({
                            userId: socket.id,
                            userName: username,
                            status: true,
                            count: 0,
                        });
                        callcenter.save(function (err) {
                            if (err) {
                                console.log(err);
                            }
                        })
                    }
                }
            });
        }


        //update lastaccess time
        updateUserMongoDb(socket.id, username, role, true, Date.now(),function (lastaccess) {

            // update status user
            var queryUser = User.find({});
            queryUser.sort('-lastaccess');
            queryUser.exec(function (err, docs) {
                if (err) throw err;
                docs.forEach(function (el, index) {
                    var timeLastaccess = new Date(el.lastaccess).getTime();
                    var timeLeft = 30000;
                    var timeNow = Date.now();
                    console.log('check');
                    console.log((timeLeft + timeLastaccess) < timeNow);
                    if ((timeLeft + timeLastaccess) < timeNow) {
                        console.log("user het thoi" + el.username);
                        //save status to mysql
                        dbmysql.query('SELECT * FROM users WHERE username = ?', [el.username], function (err, result) {
                            if (result) {
                                dbmysql.query('UPDATE users SET status = 2 WHERE username = ?', [el.username], function (err, result) {

                                });
                            }
                        });
                        User.update(
                            {username: el.username},
                            {$set: {status: false}},
                            {w: 1},
                            function (err) {
                                if (err)
                                    throw err;
                                console.log('entry updated');
                            }
                        );
                        // delete usernames[el.username];
                        io.sockets.emit('updateusers', usernames);
                    }
                });
            });
            //end update status

            // update status callcenter
            var queryCallCenter = CallCenter.find({});
            queryCallCenter.sort('-lastaccess');
            queryCallCenter.exec(function (err, docs) {
                if (err) throw err;
                docs.forEach(function (el, index) {
                    var timeLastaccess = new Date(el.lastaccess).getTime();
                    var timeLeft = 30000;
                    var timeNow = Date.now();
                    console.log('check callcenter');
                    console.log((timeLeft + timeLastaccess) < timeNow);
                    if ((timeLeft + timeLastaccess) < timeNow) {
                        console.log("user het thoi" + el.userName);
                        //save status to mysql
                        dbmysql.query('SELECT * FROM users WHERE username = ?', [el.userName], function (err, result) {
                            if (result) {
                                dbmysql.query('UPDATE users SET status = 2 WHERE username = ?', [el.userName], function (err, result) {

                                });
                            }
                        });
                        CallCenter.update(
                            {userName: el.userName},
                            {$set: {status: false}},
                            {w: 1},
                            function (err) {
                                if (err)
                                    throw err;
                                console.log('entry updated');
                            }
                        );
                        // delete usernames[el.username];
                        io.sockets.emit('updatecallcenter', usernames);
                    }
                });
            });

        });
        //end update lastaccess time


        fetchUserOnline(function (data) {
            console.log('updatevisitors');
            socket.emit('updatevisitors', data);
        });

        usernames[username] = socket.id;
        sockets[username] = socket;
        console.log(username + 'da dang nhap');
        socket.broadcast.emit('updatecallcenter', 'Update status of callcenters');
        socket.broadcast.emit('updateexpert', 'Update status of expert');
        //if(role == 200){
        //	socket.broadcast.emit('updatevisitors',username);
        //}
        console.log('update user');
    });
//------------end subcribe-------------------


    socket.on('signout', function (room) {
        console.log('leaving room');
        //update user's status mysql
        ChangeStatusUserMysql("2", room);
        socket.broadcast.emit('updatecallcenter', 'Update status of callcenters');
        socket.broadcast.emit('updateexpert', 'Update status of expert');
        socket.leave(room);
    });

    //tao phong
    socket.on('adduserroom', function (username, room, type) {
        var callcenterName = '';
        var arrayTemp = room.split('-');
        if (username == 'CallCenter') {
            queryCallcenter = CallCenter.find({status: true}).sort({
                "count": 1
            }).limit(1);
            queryCallcenter.exec(function (err, cc) {
                // if(err) throw  err;
                if (cc.length > 0) {
                    cc.forEach(function (el, index) {
                        console.log(el);
                        console.log(el.count);
                        CallCenter.update(
                            {userName: el.userName},
                            {$inc: {count: 1}},
                            {w: 1},
                            function (err) {
                                if (err) throw err;
                                console.log('update callcenter user success '+ (el.count+1));
                            })
                        callcenterName = el.userName;

                        room = arrayTemp[0] + '-' + callcenterName;

                        getRoomMongoose(room, '', '','', function (r) {
                            if (!r) {
                                socket.join(room);
                                console.log(usernames.indexOf(socket.id) + ' da tao phong');
                                console.log('da tao phong ' + room);
                                activity = {
                                    callcenter: callcenterName,
                                    student: arrayTemp[0],
                                    createdDateTime: new Date().toMysqlFormat('DateTime'),
                                    createdDate: new Date().toMysqlFormat(),
                                    room:room,
                                };
                                createActivity(activity, function (ac) {
                                    io.in(room).emit('updatechatactivityid', {
                                        'userName': callcenterName,
                                        'activityId': ac.insertId,
                                        'role': 'callcenter',
                                        'room':room,
                                    });
                                    createRoomMongoose(room, arrayTemp[0], ac.insertId, function (cr) {
                                    });
                                    createRoomMongoose(room, callcenterName, ac.insertId, function (cr) {
                                    });
                                });
                            } else {
                                console.log(callcenterName + ' da vao phong ' + room);
                            }
                        });
                        //if(typeof rooms[room] === 'undefined'){
                        //	socket.join(room);
                        //	console.log(usernames.indexOf(socket.id) +' da tao phong');
                        //	console.log('da tao phong '+ room);
                        //	rooms[room] = room;
                        //}else{
                        //	console.log(callcenterName + ' da vao phong ' + room);
                        //}
                        if (typeof sockets[callcenterName] != 'undefined') {
                            sockets[callcenterName].join(room);
                        }
                        if (type == 'mentorlist') {
                            console.log('them user tu mentorlist');
                            io.in(room).emit('updateroom', {room: room, username: callcenterName});
                        }

                        callcenterRoom[arrayTemp[0]] = callcenterName;
                    });
                } else {
                    console.log('deo co callcenter online');
                }
            })
        } else {
            getRoomMongoose(room,arrayTemp[0],'','',function(r){
               if(!r){
                   socket.join(room);
                   getUserMongodb(socket.id, '', function (u) {
                       if (u) {
                           console.log(u.username + ' da tao phong');
                       } else {
                           getCallCenterMongodb('', socket.id, function (uC) {
                               if(uC){
                                   activity = {};
                                       activity = {
                                           callcenter: uC.userName,
                                           student: arrayTemp[0],
                                           createdDateTime: new Date().toMysqlFormat('DateTime'),
                                           createdDate: new Date().toMysqlFormat(),
                                           room: room,
                                       };
                                       createActivity(activity, function (ac) {
                                           io.in(room).emit('updatechatactivityid', {
                                               'userName': uC.userName,
                                               'activityId': ac.insertId,
                                               'role': 'callcenter',
                                               'room':room,
                                           });
                                           createRoomMongoose(room, uC.userName, ac.insertId, function (cr) {
                                               console.log('da tao phong ' + cr.room);
                                           });
                                       });
                                   console.log(u.userName + ' da tao phong');
                                   //createRoomMongoose(room, u.userName, '',function (cr) {
                                   //    console.log('da tao phong ' + cr.room);
                                   //});
                               }
                           })
                       }
                   });
               }
            });

            /**
             * check neu user la mentor thi tao mot record trong mysql
             */
            getUserMongodb('', username, function (u) {
                if (u.role == ROLE_MENTOR) {
                    activity = {
                        mentor: username,
                        student: arrayTemp[0],
                        createdDateTime: new Date().toMysqlFormat('DateTime'),
                        createdDate: new Date().toMysqlFormat(),
                        room:room,
                    };
                    createActivity(activity, function (ac) {
                        createRoomMongoose(room, username,ac.insertId, function (cr) {
                        });
                        console.log(username + ' da vao phong ' + room);
                        sockets[username].join(room);
                        console.log(ac);
                        io.in(room).emit('updatechatactivityid', {
                            'userName': username,
                            'activityId': ac.insertId,
                            'role': 'mentor',
                            'room':room,
                        });
                    });
                }
            })
            /* ======= tao xong record chat_activity trong mysql ==== */

            if (type == 'mentorlist') {
                console.log('them user tu mentorlist');
                io.in(room).emit('updateroom', {room: room, username: username});
            }
            getCallCenterMongodb(null, socket.id, function (c) {
                if (c) {
                    console.log(c.userName);
                    callcenterRoom[username] = c.userName;
                }
            })
        }
    });
// =============end adduserroom======================


// gửi tin nhắn
    socket.on('send', function (data) {
        if (data.userreceiver == 'CallCenter') {
            data.room = data.usersender + '-' + callcenterRoom[data.usersender];
        }

        // save message to mongo
        message = {
            sender: data.usersender,
            avatar:data.avatar,
            receiver: data.room,
            msg: data.message,
            imgPath: '',
        };
        saveMesgMongoose(message, function (m) {
            console.log(m);
        });
        // end save message to mongo

        //update lastaccess time
        updateUserMongoDb(null, data.usersender, data.role, true, Date.now(),function (lastaccess) {

            // update status user
            var queryUser = User.find({});
            queryUser.sort('-lastaccess');
            queryUser.exec(function (err, docs) {
                if (err) throw err;
                docs.forEach(function (el, index) {
                    var timeLastaccess = new Date(el.lastaccess).getTime();
                    var timeLeft = 300000;
                    var timeNow = Date.now();
                    console.log('check');
                    console.log((timeLeft + timeLastaccess) < timeNow);
                    if ((timeLeft + timeLastaccess) < timeNow) {
                        console.log("user het thoi " + el.username);
                        //save status to mysql
                        dbmysql.query('SELECT * FROM users WHERE username = ?', [el.username], function (err, result) {
                            if (result) {
                                dbmysql.query('UPDATE users SET status = 2 WHERE username = ?', [el.username], function (err, result) {

                                });
                            }
                        });
                        User.update(
                            {username: el.username},
                            {$set: {status: false}},
                            {w: 1},
                            function (err) {
                                if (err)
                                    throw err;
                                console.log('entry updated');
                            }
                        );
                        // delete usernames[el.username];
                        io.sockets.emit('updateusers', usernames);
                    }
                });
            });
            //end update status

        });
        //end update lastaccess time

        //if(typeof data.firstuser === 'undefined'){
        //	data.firstuser = data.usersender;
        //	console.log('Nguoi khoi mao cau chuyen la '+data.firstuser);
        //}
        room = data.room;
        console.log(data.usersender + ' sending message to ' + room);
        //if(data.role == 10 ){
        //	arrayTemp = room.split('-');
        //	data.room = arrayTemp[0]+'-CallCenter';
        //	data.usersender = 'CallCenter'
        //	console.log('mess gửi tu callcenter' + data.room);
        //}
        socket.broadcast.to(room).emit('msg_user_handle', data);
    });

    socket.on('leaveroom', function (username, room) {
        getUserMongodb('', username, function (u) {
            if (u && u.role == ROLE_STUDENT) {
                var clients = io.sockets.adapter.rooms[room];
                for (var clientId in clients) {
                    //this is the socket of each client in the room.
                    var clientSocket = io.sockets.connected[clientId];

                    getUserMongodb(clientSocket.id, '', function (u) {
                        getCallCenterMongodb('',clientId,function(cc){
                            if(cc.length > 0){
                                cc.forEach(function(value,index){
                                    CallCenter.update({userName: value.userName},
                                        {$inc: {'count':-1}},
                                        {w: 1},
                                        function (err) {
                                            if (err) throw err;
                                            console.log('update callcenter user success');
                                        })
                                })
                            }
                        });
                        clientSocket.emit('leaved', u.username, room);
                        console.log(clientId + ' da roi khoi phong');
                        clientSocket.leave(room);
                    })
                }
                deleteRoomMongoose(room, '', function (r) {
                    if (r) {
                        console.log('Da xoa');
                    }
                })
            } else{
                socket.leave(room);
                io.in(room).emit('leaved', username, room);
                updateStatusRoomMongoose('',room, username,false, function (r) {
                    if (r) {
                        console.log('cap nhat trang thai phong '+ r.room+ ' thanh cong');
                    }
                })
            }
            //else {
            //    arrayroom = sockets[username].rooms;
            //    for (var i = 0; i < arrayroom.length; i++) {
            //        console.log((arrayroom[i] == room));
            //        if (arrayroom[i] == room) {
            //            sockets[username].leave(room);
            //            console.log(username + ' da roi khoi phong');
            //            io.in(room).emit('leaved', username, room);
            //        }
            //    }
            //}
        })
    });

    //-----------upload image---------------------
    socket.on('user image', function (msg) {
        var base64Data = decodeBase64Image(msg.imageData);
        // if directory is not already created, then create it, otherwise overwrite existing image

        if (!fs.existsSync(path.join(CHAT_FOLDER, msg.room))) {
            fs.mkdirSync(path.join(CHAT_FOLDER, msg.room));

        }

        if (!fs.existsSync(path.join(CHAT_FOLDER, msg.room, msg.imageMetaData))) {
            fs.mkdirSync(path.join(CHAT_FOLDER, msg.room, msg.imageMetaData))
        }

        if (!fs.existsSync(path.join(CHAT_FOLDER, msg.room, msg.imageMetaData, msg.usersender))) {
            fs.mkdirSync(path.join(CHAT_FOLDER, msg.room, msg.imageMetaData, msg.usersender));
        }

        // write/save the image
        // TODO: extract file's extension instead of hard coding it
        if(msg.imageSize <= FILE_ALLOW.size && FILE_ALLOW.type.indexOf(msg.imageType) >= 0){
            fs.writeFile(path.join(CHAT_FOLDER, msg.room, msg.imageMetaData, msg.usersender, msg.imageName), base64Data.data, function (err) {
                if (err) {
                    console.log('ERROR:: ' + err);
                    throw err;
                }
            });

            msg.imgPath = '/media/chat/' + msg.room + '/' + msg.imageMetaData + '/' + msg.usersender + '/' + msg.imageName;
            message = {
                sender: msg.usersender,
                avatar:msg.avatar,
                receiver: msg.room,
                msg: '',
                imgPath: msg.imgPath,
            };
            saveMesgMongoose(message, function (m) {
                console.log(m);
            });
            socket.broadcast.to(msg.room).emit('msg_user_handle', msg);
        }else{
            socket.emit('msg_user_error',{room:msg.room,mesg:'Bạn chỉ được tải lên các file ảnh dưới 10MB'})
        }
    });
    socket.on('feedback',function(room,data){
        for (var key in data){
            activity = {
                id:data[key].activityId,
                rating:data[key].rating,
                note:data[key].comment,
                student:room.split('-')[0],
            }
            updateActivity(activity,function(rows){
                sockets[key].leave(room);
                io.in(room).emit('leaved',key,room);
                console.log(key + ' da roi khoi room');
                deleteRoomMongoose(room,'','',function(r){
                    console.log('da xoa room '+ room + ' khoi mongodb');
                })
            });
        }
        //console.log(activity);
       //updateActivity()
    });
    socket.on('disconnect', function () {
        getUserMongodb(socket.id, '', function (u) {
            console.log("Trang thai disconnect cua " + socket.id);
            console.log(u);
            console.log(u.username + ' da ngat ket noi');
        })
    })
});

