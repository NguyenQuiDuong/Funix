var express = require('express');
var app = express();
var io = require('socket.io')();
io.listen(8008);
var fs = require('fs');
var mongoose = require('mongoose');
var mysql = require('mysql');
// app.listen(8008);

// routing
//app.get('/', function (req, res) {
//  res.sendfile(__dirname + '/chat.html');
//});
var dbmysql = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	database: 'mentor'
});
mongoose.connect('mongodb://127.0.0.1/chat', function(err){
	if(err){
		console.log(err);
	} else{
		console.log('Connected to mongodb!');
	}
});

dbmysql.connect(function(err){
	if (err) {
		console.log(err);
	}else{
		console.log('Connected to mysql');
	}
});

var messageSchema = mongoose.Schema({
	sender: String,
	receiver: String,
	msg: String,
	created: {type: Date, default: Date.now}
});

var userSchema = mongoose.Schema({
	userid: String,
	username: String,
	status: Boolean,
	lastaccess: {type: Date, default:Date.now}
});

var callcenterSchema = mongoose.Schema({
	userId :String,
	userName: String,
	count : Number,
	lastaccess: {type: Date, default:Date.now}
});

var Message = mongoose.model('Message', messageSchema);
var User = mongoose.model('User',userSchema);
var CallCenter = mongoose.model('CallCenter',callcenterSchema);

// usernames which are currently connected to the chat
var usernames = [];
var sockets = [];
var rooms = [];
var callcenterRoom = [];
function check_key(v)
{
	var val = '';
	
	for(var key in usernames)
    {
		if(usernames[key] == v)
		val = key;
	}
	return val;
}

Date.prototype.toMysqlFormat = function (type) {
	function pad(n) { return n < 10 ? '0' + n : n }
	if(type == 'DateTime'){
		return this.getFullYear() + "-" + pad(1 + this.getMonth()) + "-" + pad(this.getDate()) + " " + pad(this.getHours()) + ":" + pad(this.getMinutes()) + ":" + pad(this.getSeconds());
	}else{
		return this.getFullYear() + "-" + pad(1 + this.getMonth()) + "-" + pad(this.getDate());
	}
};

function createCallcenterActivity(activity){
	dbmysql.query('INSERT INTO callcenter_activities SET ?',activity, function(err,res){
		if(err) throw err;
		console.log('Da them vao callcenter_activities: ',res.insertId);
	})
}

function getCallcenterActivity(activity){
	if(activity.student && activity.createdDateTime){
		dbmysql.query('SELECT * FROM callcenter_activities WHERE callcenter = ? AND  createdDate = ? ',[activity.callcenter,activity.getCreatedDate],function(err,rows){
			if(err) throw err;
			return rows;
		})
	}
}

function ChangeStatusUserMysql(status,username){

	dbmysql.query('SELECT * FROM users WHERE username = ?',[username],function(err,result){
		if (result) {
			dbmysql.query('UPDATE users SET status = ? WHERE username = ?',[status,username],function(err,result){
				if(err){
					console.log(err)
				}else{
					if(status == "1"){
						console.log('Doi trang thai cua '+username+' sang online thanh cong');
					}
					if(status == "2"){
						console.log('Doi trang thai cua '+username+' sang offline thanh cong');
					}
				}
			});
		}
	});
}

function getCallCenterMongodb(username,userId,callback){
	queryCallcenter = '';
	if (username){
		queryCallcenter = CallCenter.find({userName:username}).sort({
			"count" : 1
		}).limit(1);
	}
	if(userId){
		queryCallcenter = CallCenter.find({userId:userId}).sort({
			"count" : 1
		}).limit(1);
	}
callcenter  = '';
	queryCallcenter.exec(function(err,cc) {
		 if(err) throw  err;
		if(cc){
			cc.forEach(function (el, index) {
				callcenter = el;
			});
			callback(callcenter);
		}else{
			callback(false);
		}
	});
}

function fetchUserOnline(user,callback){
	queryUser = '';
	arrayUsername = [];
	if(user == ''){
		queryUser = User.find({status:true});
		queryUser.exec(function(err,result){
			if(err) throw err;
			if(result){
				result.forEach(function(el,index){
					arrayUsername.push(el.username);
				});
				callback(arrayUsername);
			}
		})
	}
}

io.sockets.on('connection', function (socket) {
socket.on('subscribe', function(username,role) {
			//save status to mysql
		ChangeStatusUserMysql("1",username);
		if(role == '10'){
			var querygetCallCenter = CallCenter.find({userName:username});
				querygetCallCenter.exec(function(err,result){
				if(err){
					throw err;
				}else{
					if(result.length > 0){
						CallCenter.update(
							{userName:username},
							{$set:{userId:socket.id}},
							{w:1},
							function(err) {
								if(err)throw err;
								console.log('update callcenter user success');
							}
						)
					}else{
						var callcenter = new CallCenter({
							userId: socket.id,
							userName: username,
							count: 0,
						});
						callcenter.save(function(err){
							if(err){
								console.log(err);
							}
						})
					}
				}
			});
		}


	//update lastaccess time
	var querygetUser = User.find({username:username});
	querygetUser.exec(function(err,result){
		if(err){
			throw err;
		}else{
			if(result){
				User.update(
						{username:username},
						{$set:{status:true,lastaccess:Date.now()}},
						{w:1},
						function(err) {
							if(err)throw err;
							console.log('lastaccess updated at '+Date.now());
						}
				)
			}
		}
	});
	//end update lastaccess time

	fetchUserOnline('',function(data){
		socket.emit('updatevisitors',data);
	});

		usernames[username] = socket.id;
		sockets[username] = socket;
		console.log(username + 'da dang nhap');
        socket.broadcast.emit('updatecallcenter','Update status of callcenters');
        socket.broadcast.emit('updateexpert','Update status of expert');
		if(role == 200){
			socket.broadcast.emit('updatevisitors',username);
		}
        console.log('update user'); 
    });

    socket.on('signout', function(room) {  
        console.log('leaving room');
        //update user's status mysql
        ChangeStatusUserMysql("2",room);
		socket.broadcast.emit('updatecallcenter','Update status of callcenters');
        socket.broadcast.emit('updateexpert','Update status of expert');
        socket.leave(room); 
    });

	//tao phong
	socket.on('adduserroom',function(username,room,type){
		var callcenterName = '';
		if(username == 'CallCenter'){
			queryCallcenter = CallCenter.find({}).sort({
				"count" : 1
			}).limit(1);
			queryCallcenter.exec(function(err,cc){
				// if(err) throw  err;
				cc.forEach(function(el,index){
					callcenterName = el.userName;
					arrayTemp = room.split('-');
					room = arrayTemp[0]+'-'+callcenterName;

					if(typeof rooms[room] === 'undefined'){
						socket.join(room);
						console.log(usernames.indexOf(socket.id) +' da tao phong');
						console.log('da tao phong '+ room);
						rooms[room] = room;
					}else{
						console.log(callcenterName + ' da vao phong ' + room);
					}
					sockets[callcenterName].join(room);
					if(type == 'mentorlist'){
						console.log('them user tu mentorlist');
						io.in(room).emit('updateroom', {room:room,username:callcenterName});
					}
					activity = {
						callcenter: callcenterName,
						student: arrayTemp[0],
						createdDateTime: new Date().toMysqlFormat('DateTime'),
						createdDate: new Date().toMysqlFormat(),
					};
					createCallcenterActivity(activity);
					callcenterRoom[arrayTemp[0]] = callcenterName;
				});
			})
		}else{
			if(typeof rooms[room] === 'undefined'){
				socket.join(room);
				console.log(usernames.indexOf(socket.id) +' da tao phong');
				console.log('da tao phong '+ room);
				rooms[room] = room;
			}
			console.log(username + ' da vao phong ' + room);
			sockets[username].join(room);
			if(type == 'mentorlist'){
				console.log('them user tu mentorlist');
				io.in(room).emit('updateroom', {room:room,username:username});
			}
			getCallCenterMongodb(null,socket.id,function(c){
				if(c){
					console.log(c.userName);
					callcenterRoom[username] = c.userName;
				}
			})
		}
	});

// gửi tin nhắn
    socket.on('send', function(data) {
    	if(data.userreceiver == 'CallCenter'){
    		data.room = data.usersender+'-'+callcenterRoom[data.usersender];
    	}

        // save message to mongo
        var newMsg = new Message({
        	sender: data.usersender,
        	receiver: data.room,
        	msg: data.message
        });
			newMsg.save(function(err,msg){
				if(err) throw err;
				if(msg){
					findMsg = Message.find({id:msg.id});
					findMsg.exec(function(err,result){
						console.log(result.msg);
					})
				}
			});
		// end save message to mongo

		//update lastaccess time
		var querygetUser = User.find({username:data.usersender});
		querygetUser.exec(function(err,result){
			if(err){
				throw err;
			}else{
				if(result){
					User.update(
							{username:data.usersender},
							{$set:{status:true,lastaccess:Date.now()}},
							{w:1},
							function(err) {
								if(err)throw err;
								console.log('lastaccess updated');
							}
					)
				}
			}
		});
		//end update lastaccess time

		// update status user
		var queryUser = User.find({});
		queryUser.sort('-lastaccess');
		queryUser.exec(function(err, docs){
			if(err) throw err;
			docs.forEach(function(el, index) {
				var timeLastaccess = new Date(el.lastaccess).getTime();
				var timeLeft = 30000;
				var timeNow = Date.now();
				if((timeLeft+timeLastaccess) < timeNow){
					console.log("user het thoi"+el.username);
					//save status to mysql
					dbmysql.query('SELECT * FROM users WHERE username = ?',[el.username],function(err,result){
						if (result) {
							dbmysql.query('UPDATE users SET status = 2 WHERE username = ?',[el.username],function(err,result){

							});
						}
					});
					User.update(
							{username:el.username},
							{$set:{status : false}},
							{w:1},
							function(err) {
								if(err)
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

		//if(typeof data.firstuser === 'undefined'){
		//	data.firstuser = data.usersender;
		//	console.log('Nguoi khoi mao cau chuyen la '+data.firstuser);
		//}
		room = data.room;
		console.log(data.usersender+' sending message to '+ room);
		//if(data.role == 10 ){
		//	arrayTemp = room.split('-');
		//	data.room = arrayTemp[0]+'-CallCenter';
		//	data.usersender = 'CallCenter'
		//	console.log('mess gửi tu callcenter' + data.room);
		//}
        socket.broadcast.to(room).emit('msg_user_handle', data);
    });

    socket.on('leaveroom',function(username,room){
    	arrayroom = sockets[username].rooms;
    	for (var i = 0; i < arrayroom.length; i++) {
    		console.log((arrayroom[i] == room));
    		if(arrayroom[i] == room){
    			sockets[username].leave(room);
    			console.log(username + ' da roi khoi phong');
    			io.in(room).emit('leaved',username,room);
    		}
		}
	})
});

