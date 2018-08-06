const C = require('../src/config');
const F = require('../src/mysql-function');
const Q = require('../src/mysql-query-string');
const dateTime = require('../src/date-time.js');
const db = C.db;

//
//
//
//
//таблица пользователей
const usersDB = {};

//Найти пользователя 
usersDB.selectUser = function (q, callback) {
	let email = q.email || null;
	let pass = q.pass 	|| null;
	let login = q.login || null;
	let id = q.userId 	|| null;
	
	let queryValues = F.queryValueToString([
		(id) 		? Q().even({id : id}).done() 				 : ``,
		(email)	? Q().even({email : email}).done() 	 : ``,
		(pass) 	? Q().even({password : pass}).done() : ``,
		(login) ? Q().even({login : login}).done() 	 : ``
	]);
	
	let query = Q()
	.SELECT('*')
	.FROM(db.users)
	.WHERE()
	.raw(queryValues)
	.end(); 
	
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
	
	let query = Q()
	.SELECT('*')
	.FROM(db.users)
	.WHERE()
	.IN({id : q.userList})
	.end();
	
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
	
	let query = Q()
	.UPDATE(db.users)
	.SET({
		activeChatId : q.chatId
	}).WHERE()
	.even({
		id : q.userId
	}).end();
	
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.affectedRows) ? true : false,
			msg: (e.affectedRows) ? 'Данные изменены' : ''
		});
	});
}

//создать новового пользователя
usersDB.insertNewUser = function (q, callback) {
	
	let query = Q()
	.INSERT(db.users)
	.VALUES({
		login : q.login,
		email : q.email,
		password : q.pass,
		registerDate : dateTime().formated
	}).end();
	
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
	
	let query = Q()
	.SELECT('*')
	.FROM(db.users)
	.WHERE()
	.even({
		id : q.id
	}).end();
	
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
