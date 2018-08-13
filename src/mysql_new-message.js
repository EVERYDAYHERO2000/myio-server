const F = require('../src/mysql-function');
const dateTime = require('../src/date-time');

const tagsDB = require('../src/mysql__tagsDB');
const chatsDB = require('../src/mysql__chatsDB');
const spacesDB = require('../src/mysql__spacesDB');
const usersDB = require('../src/mysql__usersDB');
const messagesDB = require('../src/mysql__messagesDB');

//создать новое сообщение
//залогинется
//создать сообщение
const newMessage = function(q,callback){
	let email = q.email;
	let pass = q.pass;
	let text = q.text;
	let userId = q.userId;
	let chatsId = q.chatsId;
	let date = dateTime().formated;
	
	usersDB.selectUser({
		email: email,
		pass: pass
	}, function(selectUser__result){
	
		messagesDB.insertNewMessage({
			text : q.text,
			userId : q.userId,
			chatsId : q.chatsId,
			date : date
		}, function(insertNewMessage__result){
			callback({
				status: true,
				msg: 'Сообщение создано',
				data: {
					id : insertNewMessage__result.data.insertId,
					text : text,
					date : date,
					userId : userId,
					chatsId : chatsId
				}
			});
		});
		
	});
	// .data.insertId
}

module.exports = newMessage;