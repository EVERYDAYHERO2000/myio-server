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
	let userId = F.def(q.userId); 
	
	//let query = `SELECT * FROM ${db.chatsRooms} WHERE usersId = ${userId}`;
	let query = Q().SELECT('*').FROM(db.chatsRooms).WHERE().even({usersId : userId}).end();
	
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
	
	//let query = `SELECT * FROM ${db.chatsRooms} WHERE chatsId IN (${idStr});`;
	let query = Q().SELECT('*').FROM(db.chatsRooms).WHERE().IN({chatsId : idStr}).end();
	
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
	
	//let query = `SELECT * FROM ${db.chats} WHERE id IN (${idStr}) AND isDeleted = 0`;
	let query = Q().SELECT('*').FROM(db.chats).WHERE().IN({id : idStr}).AND().even({isDeleted : '0'}).end(); 
	
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
	
	//let query = `SELECT * FROM ${db.chatsTags} WHERE chatsId IN (${chatsId})`;
	query = Q().SELECT('*').FROM(db.chatsTags).WHERE().IN({chatsId: chatsId}).end();
	
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

	//let query = `INSERT INTO ${db.chats} (name, icon, createrId, spacesId, creationDate, taskStatus, parentId, deadlineDate) VALUES (${name}, ${icon}, ${createrId}, ${spacesId}, ${creationDate}, ${taskStatus}, ${parentId}, ${deadlineDate});`;
	let query = Q().INSERT(db.chats).VALUES({
		name : name,
		icon : icon,
		createrId : createrId,
		spacesId : spacesId,
		creationDate : creationDate,
		taskStatus : taskStatus,
		parentId : parentId,
		deadlineDate : deadlineDate
	}).end();
	
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
	
	//let query = `INSERT INTO ${db.chatsRooms} (chatsId, usersId, chatRole, joinDate) VALUES ( ${chatsId}, ${usersId}, ${chatRole}, ${joinDate} );`;
	let query = Q().INSERT(db.chatsRooms).VALUES({
		chatsId : chatsId,
		usersId : usersId,
		chatRole : chatRole,
		joinDate : joinDate
	}).end();
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.affectedRows) ? true : false,	
			msg: (e.affectedRows) ? 'Пользователь добавлен в чат' : 'Пользователь не добавлен в чат'
		});
	});
}

module.exports = chatsDB;