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
			status: F.status(e.length),
			msg: F.msg(e.length,[`Пользователь ${email} найден`,`Пользователь ${email} не найден`]),
			data: e[0]
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
			status: F.status(e.affectedRows),	
			msg: F.msg(e.affectedRows,['Пользователь найден','Пользователь не найден']),
			data: e
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
			status: F.status(e.affectedRows),
			msg: F.msg(e.affectedRows,['Данные изменены','']),
			data: e
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
			status: F.status(e.affectedRows),
			msg: F.msg(e.affectedRows,[`Пользователь ${email} добавлен`,`Пользователь ${email} не добавлен`]),
			data: e
		});
	});
};


module.exports = usersDB;
