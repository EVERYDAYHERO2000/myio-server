var C = require('../src/config');
var dateTime = require('../src/date-time.js');
var mysql = require('mysql');
var db = C.db;

var mysqlQuery = function (e, q, callback) {
	switch (e) {
		case 'findUser':
			usersDB.findUser(q, callback);
			break;

		case 'login':
			usersDB.login(q, callback);
			break;

		case 'registration':
			usersDB.registration(q, callback);
			break;

		case 'getSettings':
			userDB.getSettings(q, callback);
			break;

		case 'setSettings':
			usersDB.setSettings(q, callback);
			break;
	}
}

module.exports = mysqlQuery;

//
//
//
//
//таблица пользователей
var usersDB = {}

//Найти пользователя по email
usersDB.findUser = function (q, callback) {
	let email = q.email;
	let query = `SELECT * FROM ${db.users} WHERE email = "${email}";`;
	connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.length) ? true : false,
			msg: (e.length) ? 'Пользователь найден' : 'Пользователь не найден'
		});
	});
}

//Найти пользователя по email и паролю
usersDB.login = function (q, callback) {
	let email = q.email;
	let pass = q.pass;
	let query = `SELECT * FROM ${db.users} WHERE email = "${email}" AND password = "${pass}";`;
	connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.length) ? true : false,
			msg: (e.length) ? 'Пользователь найден' : 'Пользователь не найден'
		});
	});
}

//Регистрация нового пользователя. 
//Проверка существования пользователя
//создание пользователя
//создание пространства
//создание чата
usersDB.registration = function (q, callback) {
	usersDB.findUser(q, function (findUser__result) {
		if (!findUser__result.status) {
			usersDB.createUser(q , function(createUser__result){
				if (createUser__result.status) {
					let space = {
						userId: createUser__result.id,
						date: dateTime().formated,
						space: q.space,
						icon: null
					}
					spacesDB.createSpace (space, function(createSpace__result){
						let chat = {
							userId: createUser__result.id,
							name: 'Instruction',
							icon: null,
							spacesId: createSpace__result.id,
							creationDate: dateTime().formated,
							taskStatus: 'chat',
							parentId: null,
							deadlineDate: null				
						}
						chatsDB.createChat (chat, callback);
					});
				}
			});
		} else {
			if (callback) callback({
				status: false,
				msg: 'Пользователь не добавлен, уже есть пользователь с такими данными'
			});
		}
	});
}

//создать новового пользователя
usersDB.createUser = function (q, callback) {
	let login = def(q.login);
	let email = def(q.email);
	let pass = def(q.pass);
	let date = def(dateTime().formated);
	let query = `INSERT INTO ${db.users} (login,email,password,registerDate) VALUES (${login}, ${email}, ${pass}, ${date});`;
	connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.affectedRows) ? true : false,
			msg: (e.affectedRows) ? 'Пользователь добавлен' : 'Пользователь не добавлен',
			id: e.insertId
		});
	});
};

//Загрузить настройки пользователя по id
usersDB.getSettings = function (q, callback) {
	let id = q.id;
	let query = `SELECT * FROM ${db.users} WHERE id = "${id}";`;
	connectToMYSQL(query, function (e) {
		let result = {
			status: (e.length) ? true : false,
			msg: (e.length) ? 'Данные пользователя загружены' : 'Пользователь не найден'
		};
		if (result.status) {
			result.login = e[0].login,
			result.email = e[0].password,
			result.avatar = e[0].avatar,
			result.firstName = e[0].firstName,
			result.lastName = e[0].lastName,
			result.lang = e[0].lang
		};
		if (callback) callback(result);
	});
}

//Редактировать пользователя по id
usersDB.setSettings = function (q, callback) {
	let id = q.id;
	let query = `UPDATE INTO ${db.users} WHERE id = "${id}";`;
	connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.affectedRows) ? true : false,
			msg: (e.affectedRows) ? 'Данные изменены' : ''
		});
	});
}

//
//
//
//
// пространства
var spacesDB = {};
// создать пространство
spacesDB.createSpace = function (q, callback) {
	let userId = def(q.userId);
	let space = def(q.space);
	let date = def(q.date);
	let icon = def(q.icon);
	let query = `INSERT INTO ${db.spaces} (name, spaceCreator, creationDate, icon) VALUES (${space}, ${userId}, ${date}, ${icon});`;
	connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.affectedRows) ? true : false,
			msg: (e.affectedRows) ? 'Пространство добавленно' : 'Пространство не добавлено',
			id: e.insertId
		});
	});
}


//
//
//
//
// чаты
var chatsDB = {}
// создать чат
chatsDB.createChat = function (q, callback) {
	let createrId = def(q.userId);
	let name = def(q.name);
	let icon = def(q.icon);
	let spacesId = def(q.spacesId);
	let creationDate = def(q.creationDate);
	let taskStatus = def(q.taskStatus);
	let parentId = def(q.parentId);
	let deadlineDate = def(q.deadlineDate);
	let query = `INSERT INTO ${db.chats} (name, icon, createrId, spacesId, creationDate, taskStatus, parentId, deadlineDate) VALUES (${name}, ${icon}, ${createrId}, ${spacesId}, ${creationDate}, ${taskStatus}, ${parentId}, ${deadlineDate});`;
	connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.affectedRows) ? true : false,	
			msg: (e.affectedRows) ? 'Чат добавлен' : 'Чат не добавлен',
			id: e.insertId
		});
	});
}

function def(v){
	return (v) ? '"' + v + '"' : 'NULL';
}

//mysql
function connectToMYSQL(query, callback) {
	let connection = mysql.createConnection(C.mysql);
	connection.connect(function (err) {

		if (err) throw err;
		connection.query(query, function (err, result, fields) {
			if (err) throw err;
			if (callback) callback(result);
		});
		connection.end();
	});
}