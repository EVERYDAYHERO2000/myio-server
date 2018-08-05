var C = require('../src/config');
var F = require('../src/mysql-function');
var dateTime = require('../src/date-time.js');
var db = C.db;

//
//
//
//
// чаты
var chatsDB = {};

//найти чаты в которых у пользователя есть роль
chatsDB.selectChatsByUser = function (q, callback) {
	let userId = F.def(q.userId); 
	
	let query = `SELECT * FROM ${db.chatsRooms} WHERE usersId = ${userId}`;
	
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.length) ? true : false,
			msg: (e.length) ? `Найдено ${e.length} чатов` : `Не найдено чатов`,
			chatsRooms : e
		});
	});
}

//все роли по id чата
chatsDB.selectChatsRoomsById = function (q, callback){
	let chatsId = q.chatsId; // [1,2,3] — id
	let idStr = F.arrayToString(chatsId); // "1","2","3"
	
	let query = `SELECT * FROM ${db.chatsRooms} WHERE chatsId IN (${idStr});`;
	
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.length) ? true : false,
			msg: (e.length) ? `Найдено ${e.length} чатов` : `Не найдено чатов`,
			chatsRooms : e
		});
	});
}

//загрузить чаты по Id
chatsDB.selectChatsById = function (q, callback) {
	let chatsId = q.chatsId; // [1,2,3] — id
	let idStr = F.arrayToString(chatsId); // "1","2","3"
	
	let query = `SELECT * FROM ${db.chats} WHERE id IN (${idStr}) AND isDeleted = 0`;
	
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.length) ? true : false,
			msg: (e.length) ? `Найдено ${e.length} чатов` : 'Не найдено чатов',
			chats : e
		});
	});
}

//найти все теги к чатам по Id
chatsDB.selectChatTagsById = function (q, callback) {
	let chatsId = q.chatsId; // [1,2,3] — id
	let idStr = F.arrayToString(chatsId); // "1","2","3"
	
	let query = `SELECT * FROM ${db.chatsTags} WHERE chatsId IN (${chatsId})`;
	
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.length) ? true : false,
			msg: (e.length) ? `Найдено ${e.length} чатов` : 'Не найдено чатов',
			chatsTags : e
		});
	});
}

// создать чат
chatsDB.insertNewChat = function (q, callback) {
	let createrId = F.def(q.userId);
	let name = F.def(q.name);
	let icon = F.def(q.icon);
	let spacesId = F.def(q.spacesId);
	let creationDate = F.def(q.creationDate);
	let taskStatus = F.def(q.taskStatus);
	let parentId = F.def(q.parentId);
	let deadlineDate = F.def(q.deadlineDate);

	let query = `INSERT INTO ${db.chats} (name, icon, createrId, spacesId, creationDate, taskStatus, parentId, deadlineDate) VALUES (${name}, ${icon}, ${createrId}, ${spacesId}, ${creationDate}, ${taskStatus}, ${parentId}, ${deadlineDate});`;
	
	
	
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.affectedRows) ? true : false,	
			msg: (e.affectedRows) ? 'Чат добавлен' : 'Чат не добавлен',
			id: e.insertId
		});
	});
}

//добавить пользователя в чат
chatsDB.insertUserInToChat = function(q, callback) {
	let chatsId = F.def(q.chatsId);
	let usersId = F.def(q.usersId);
	let chatRole = F.def(q.chatRole);
	let joinDate = F.def(q.joinDate);
	
	let query = `INSERT INTO ${db.chatsRooms} (chatsId, usersId, chatRole, joinDate) VALUES ( ${chatsId}, ${usersId}, ${chatRole}, ${joinDate} );`;
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.affectedRows) ? true : false,	
			msg: (e.affectedRows) ? 'Пользователь добавлен в чат' : 'Пользователь не добавлен в чат'
		});
	});
}

module.exports = chatsDB;