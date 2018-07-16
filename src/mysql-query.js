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

//Найти пользователя 
usersDB.findUser = function (q, callback) {
	let email = q.email || null;
	let pass = q.pass || null;
	let login = q.pass || null;
	let id = q.userId || null;
	
	let queryId = (id) 				? `id = "${id}"` 						: `id`;
	let queryEmail = (email) 	? `AND email = "${email}"` 	: ``;
	let queryPass = (pass) 		? `AND pass = "${pass}"` 		: ``;
	let queryLogin = (login) 	? `AND login = "${login}"` 	: ``;
	
	let query = `SELECT * FROM ${db.users} WHERE ${queryId} ${queryEmail} ${queryPass} ${queryLogin};`;
	connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.length) ? true : false,
			msg: (e.length) ? 'Пользователь найден' : 'Пользователь не найден',
			user: e[0]
		});
	});
}

//Найти пользователя по email и паролю
usersDB.login = function (q, callback) {
	let email = q.email;
	let pass = q.pass;
	
	userDB.findUser(q, function(e){
		////////////
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
			usersDB.createUser(q, function (createUser__result) {
				if (createUser__result.status) {

					spacesDB.createSpace({
						userId: createUser__result.id,
						date: dateTime().formated,
						space: q.space,
						icon: null
					}, function (createSpace__result) {

						spacesDB.createRole({
							spaceId: createSpace__result.id,
							userId: createUser__result.id,
							role: 'admin'
						}, function (createRole) {

							chatsDB.createChat({
								userId: createUser__result.id,
								name: 'Instruction',
								icon: null,
								spacesId: createSpace__result.id,
								creationDate: dateTime().formated,
								taskStatus: 'chat',
								parentId: null,
								deadlineDate: null
							}, function (createChat__result) {

								chatsDB.addUser({
									chatsId: createChat__result.id,
									usersId: createUser__result.id,
									chatRole: 'admin',
									joinDate: dateTime().formated
								}, callback);
							});
						});

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

//создать роль в пространстве
spacesDB.createRole = function (q, callback) {
	let spaceId = def(q.spaceId);
	let userId = def(q.userId);
	let role = def(q.role);
	
	let query = `INSERT INTO ${db.spacesRole} (spaceId, userId, role) VALUES ( ${spaceId}, ${userId}, ${role} );`;
	connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.affectedRows) ? true : false,
			msg: (e.affectedRows) ? 'Роль для пространства добавлена' : 'Роль для пространства не добавлена'
		});
	});
}

//найти все пространства в которых у пользователя есть роль
spacesDB.findSpacesRoles = function(q, callback) {
	let userId = def(q.useId);
	
	let query = `SELECT * FROM ${db.spacesRole} WHERE userId = "${id}";`;
	connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.length) ? true : false,
			msg: (e.length) ? `У пользователя есть роли в ${e.length} пространствах` : 'У пользователя нет ролей в пространствах',
			spaces : e
		});
	});
}

//загрузить все пространства пользователя
spacesDB.loadSpaces = function(q, callback) {
	let spaces = q.spaces;
	let idStr = (function(){
		let idArr = []; 
		for (var i = 0; i < spaces.length; i++){
			idArr.push(spaces[i].id);
		}
		return idArr.join(',').trim();
	})();
	let query = `SELECT * FROM ${db.spaces} WHERE id IN (${idStr});`;
	connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.length) ? true : false,
			msg: (e.length) ? `Загружено ${e.length} пространств` : 'Не загруженно пространств',
			spaces : e
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

//добавить пользователя в чат
chatsDB.addUser = function(q, callback) {
	let chatsId = def(q.chatsId);
	let usersId = def(q.usersId);
	let chatRole = def(q.chatRole);
	let joinDate = def(q.joinDate);
	
	let query = `INSERT INTO ${db.chatsRooms} (chatsId, usersId, chatRole, joinDate) VALUES ( ${chatsId}, ${usersId}, ${chatRole}, ${joinDate} );`;
	connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.affectedRows) ? true : false,	
			msg: (e.affectedRows) ? 'Пользователь добавлен в чат' : 'Пользователь не добавлен в чат'
		});
	});
}



//обертка для переменных в mysql
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