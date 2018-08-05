var C = require('../src/config');
var F = require('../src/mysql-function');
var dateTime = require('../src/date-time.js');
var db = C.db;

//
//
//
//
//таблица пользователей
var usersDB = {};

//Найти пользователя 
usersDB.selectUser = function (q, callback) {
	let email = q.email || null;
	let pass = q.pass 	|| null;
	let login = q.login || null;
	let id = q.userId 	|| null;
		
	let queryValues = F.queryValueToString([
		(id) 		? `id = "${id}"` 				 : ``,
		(email)	? `email = "${email}"` 	 : ``,
		(pass) 	? `password = "${pass}"` : ``,
		(login) ? `login = "${login}"` 	 : ``
	]);
	
	let query = `SELECT * FROM ${db.users} WHERE ${queryValues};`;
	
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.length) ? true : false,
			msg: (e.length) ? `Пользователь ${email} найден` : `Пользователь ${email} не найден`,
			user: e[0]
		});
	});
}

//найти всех пользователей по id
usersDB.selectUsersById = function (q, callback) {
	let userList = q.userList;
	let idStr = F.arrayToString(userList);
	
	let query = `SELECT * FROM ${db.users} WHERE id IN (${idStr})`;
	
	F.connectToMYSQL(query, function (e) {
		
		let length = e.length;
		
		for(var i = 0; i < length; i++){
			delete e[i].password;
		}
		
		if (callback) callback({
			status: (e.affectedRows) ? true : false,	
			msg: (e.affectedRows) ? 'Пользователь найден' : 'Пользователь не найден',
			users: e
		});
	});
}

//задать активный чат для пользователя
usersDB.updateActiveChat = function (q, callback) {
	let userId = F.def(q.userId);
	let chatId = F.def(q.chatId);
	
	let query = `UPDATE ${db.users} SET activeChatId = ${chatId} WHERE id = ${userId}`;
	
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.affectedRows) ? true : false,
			msg: (e.affectedRows) ? 'Данные изменены' : ''
		});
	});
}

//создать новового пользователя
usersDB.insertNewUser = function (q, callback) {
	let login = F.def(q.login);
	let email = F.def(q.email);
	let pass = F.def(q.pass);
	let date = F.def(dateTime().formated);
	
	let query = `INSERT INTO ${db.users} (login,email,password,registerDate) VALUES (${login}, ${email}, ${pass}, ${date});`;
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.affectedRows) ? true : false,
			msg: (e.affectedRows) ? `Пользователь ${email} добавлен` : `Пользователь ${email} не добавлен`,
			id: e.insertId
		});
	});
};

//Загрузить настройки пользователя по id
usersDB.selectSettingsById = function (q, callback) {
	let id = q.id;
	
	let query = `SELECT * FROM ${db.users} WHERE id = "${id}";`;
	F.connectToMYSQL(query, function (e) {
		let user = e[0];
		let result = {
			status: (e.length) ? true : false,
			msg: (e.length) ? `Данные пользователя id: ${id} загружены` : `Пользователь id: ${id} не найден`
		};
		if (result.status) {
			result.login = user.login,
			result.email = user.password,
			result.avatar = user.avatar,
			result.firstName = user.firstName,
			result.lastName = user.lastName,
			result.lang = user.lang
		};
		if (callback) callback(result);
	});
}


module.exports = usersDB;
