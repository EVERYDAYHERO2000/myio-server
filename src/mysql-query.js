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

//
//
//
//
//таблица пользователей
var usersDB = {}

//Найти пользователя по email
usersDB.findUser = function (q, callback) {
	let query = `SELECT * FROM ${db.users} WHERE email = "${q.email}";`;
	connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.length) ? true : false,
			msg: (e.length) ? 'Пользователь найден' : 'Пользователь не найден'
		});
	});
}

//Найти пользователя по email и паролю
usersDB.login = function (q, callback) {
	let query = `SELECT * FROM ${db.users} WHERE email = "${q.email}" AND password = "${q.pass}";`;
	connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.length) ? true : false,
			msg: (e.length) ? 'Пользователь найден' : 'Пользователь не найден'
		});
	});
}

//Регистрация нового пользователя
usersDB.registration = function (q, callback) {
	usersDB.findUser(q, function (findUser__result) {
		if (!findUser__result.status) {
			usersDB.createUser(q , function(createUser__result){
				if (createUser__result.status) {
					spacesDB.createSpace (q, callback);
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
	let query = `INSERT INTO ${db.users} (login,email,password,registerDate) VALUES ('${q.login}','${q.email}','${q.pass}','${dateTime().formated}');`;
	connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.affectedRows) ? true : false,
			msg: (e.affectedRows) ? 'Пользователь добавлен' : 'Пользователь не добавлен'
		});
	});
});

//Загрузить настройки пользователя
usersDB.getSettings = function (q, callback) {
	let query = `SELECT * FROM ${db.users} WHERE email = ${q.email}`;
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

//Редактировать пользователя
usersDB.setSettings = function (q, callback) {
	let query = `UPDATE INTO ${db.users}`;
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
	let query = `INSERT INTO ${db.spaces} (name, spaceCreator, creationDate, icon) VALUES ('${q.space}', '${q.userId}', '${q.date}', '${q.icon}');`;
	connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.affectedRows) ? true : false,
			msg: (e.affectedRows) ? 'Пространство добавленно' : 'Пространство не добавлено'
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
	let query = `INSERT INTO ${db.chats}`;
	connectToMYSQL(query, function (e) {
		if (callback) callback({

		});
	});
}