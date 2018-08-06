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
		usersId : q.userId
	}).end();
	
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
	
	let query = Q()
	.SELECT('*')
	.FROM(db.chatsRooms)
	.WHERE()
	.IN({
		chatsId : q.chatsId
	}).end();
	
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
	
	let query = Q()
	.SELECT('*')
	.FROM(db.chats)
	.WHERE()
	.IN({
		id : q.chatsId
	}).AND()
	.even({
		isDeleted : '0'
	}).end(); 
	
	console.log('!!!!!', query)
	
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
	
	let query = Q()
	.SELECT('*')
	.FROM(db.chatsTags)
	.WHERE()
	.IN({
		chatsId: q.chatsId
	}).end();
	
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
			status: (e.affectedRows) ? true : false,	
			msg: (e.affectedRows) ? 'Чат добавлен' : 'Чат не добавлен',
			id: e.insertId
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
			status: (e.affectedRows) ? true : false,	
			msg: (e.affectedRows) ? 'Пользователь добавлен в чат' : 'Пользователь не добавлен в чат'
		});
	});
}

module.exports = chatsDB;