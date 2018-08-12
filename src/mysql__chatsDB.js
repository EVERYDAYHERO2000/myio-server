const C = require('../src/config');
const Q = require('../src/mysql-query-string');
const F = require('../src/mysql-function');
const db = C.db;

//
//
//
//
// чаты
const chatsDB = {};

//найти чаты в которых у пользователя есть роль
chatsDB.selectChatsByUser = function (q, callback) {
	
	let query = Q()
	.SELECT('*')
	.FROM(db.chatsRooms)
	.WHERE()
	.even({
		usersId : q.usersId
	}).end();
	
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: F.status(e.length),
			msg: F.msg(e.length, [`Найдено ${e.length} чатов`,`Не найдено чатов`]),
			data : e
		});
	});
}

//все роли по id чата
chatsDB.selectChatsRoomsById = function (q, callback){
	
	let query = Q()
	.SELECT('*')
	.FROM(db.chatsRooms)
	.WHERE()
	.IN({
		chatsId : q.chatsId
	}).end();
	
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: F.status(e.length),
			msg: F.msg(e.length,[`Найдено ${e.length} чатов`,`Не найдено чатов`]),
			data : e
		});
	});
}

//найти роль в чате по id пользователя и id чата
chatsDB.selectChatsRoomsByChatAndUserId = function (q, callback){
	
	let query = Q()
	.SELECT('*')
	.FROM(db.chatsRooms)
	.WHERE()
	.even({
		chatsId : q.chatsId
	})
	.AND()
	.even({
		usersId : q.usersId
	}).end();
	
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: F.status(e.length),
			msg: F.msg(e.length,[`Найдено ${e.length} чатов`,`Не найдено чатов`]),
			data : e
		});
	});
}

//запинить/разпинить чат
chatsDB.updateChatsRoomsPinByUserId = function (q, callback){
	
	let query = Q()
	.UPDATE(db.chatsRooms)
	.SET({
		isPinned : q.isPinned
	})
	.WHERE()
	.even({
		chatsId : q.chatId
	})
	.AND()
	.even({
		usersId : q.userId
	}).end();
	
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: F.status(e.affectedRows),
			msg: F.msg(e.affectedRows,[`Пин изменен на ${q.isPinned}`,`Пин не изменен`]),
			data : e
		});
	});
}

//загрузить чаты по Id
chatsDB.selectChatsById = function (q, callback) {
	
	let query = Q()
	.SELECT('*')
	.FROM(db.chats)
	.WHERE()
	.IN({
		id : q.id
	})
	.AND()
	.even({
		isDeleted : '0'
	}).end(); 
	
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: F.status(e.length),
			msg: F.msg(e.length, [`Найдено ${e.length} чатов` , 'Не найдено чатов']),
			data : e
		});
	});
}

//найти все теги к чатам по Id
chatsDB.selectChatTagsById = function (q, callback) {
	
	let query = Q()
	.SELECT('*')
	.FROM(db.chatsTags)
	.WHERE()
	.IN({
		chatsId: q.chatsId
	}).end();
	
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: F.status(e.length),
			msg: F.msg(e.length, [`Найдено ${e.length} чатов`,'Не найдено чатов']),
			data : e
		});
	});
}

// создать чат
chatsDB.insertNewChat = function (q, callback) {

	let query = Q()
	.INSERT(db.chats)
	.VALUES({
		name : q.name,
		icon : q.icon,
		createrId : q.userId,
		spacesId : q.spacesId,
		creationDate : q.creationDate,
		taskStatus : q.taskStatus,
		parentId : q.parentId,
		deadlineDate : q.deadlineDate
	}).end();
	
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: F.status(e.affectedRows),	
			msg: F.msg(e.affectedRows, ['Чат добавлен','Чат не добавлен']),
			data: e
		});
	});
}

//добавить пользователя в чат
chatsDB.insertUserInToChat = function(q, callback) {
	
	let query = Q()
	.INSERT(db.chatsRooms)
	.VALUES({
		chatsId : q.chatsId,
		usersId : q.usersId,
		chatRole : q.chatRole,
		joinDate : q.joinDate
	}).end();
	
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: F.status(e.affectedRows),	
			msg: F.msg(e.affectedRows, ['Пользователь добавлен в чат','Пользователь не добавлен в чат']),
			data: e
		});
	});
}

module.exports = chatsDB;