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
			msg: (e.length) ? `Пользователь ${email} найден` : `Пользователь ${email} не найден`,
			user: e[0]
		});
	});
}

//Найти пользователя по email и паролю
usersDB.login = function (q, callback) {
	let email = q.email;
	let pass = q.pass;
	
	//найти пользователя
	userDB.findUser({
		email: email,
		pass: pass
	}, function(findUser__result){
		
		//найти все пространства в которых у пользователя есть роль
		spacesDB.findSpacesRoles({
			useId: findUser__result.user.id
		},function(findSpacesRoles__result){
			
			let spaces = [];
			for (var i = 0; i < findSpacesRoles__result.spaces.length; i++ ){
				spaces.push(findSpacesRoles__result.spaces[i].spaceId);
			}
			
			//загрузить все пространства пользователя
			spacesDB.loadSpaces({
				spaces: spaces
			},function(loadSpaces__result){
				
				//найти все чаты с ролью пользователя
				chatsDB.loadChatsByUser({
					userId: findUser__result.user.id
				},function(loadChatsByUser__result){
					
					let chatsId = [];
					for (var i = 0; i < loadChatsByUser__result.chatsRooms.length; i++ ){
						chatsId.push(loadChatsByUser__result.chatsRooms[i].chatsId);
					}
					
					//загрузить чаты пользователя
					chatsDB.loadChats({
						chatsId: chatsId
					},function(loadChats__result){
						
					});
				});
			});
		});
		////////////
	});
}

//Регистрация нового пользователя. 
//Проверка существования пользователя
//создание пользователя
//создание пространства
//создание чата
usersDB.registration = function (q, callback) {
	let login = q.login;
	let email = q.email;
	let pass = q.pass;
	
	//есть ли пользователь
	usersDB.findUser({
		login: login,
		email: email,
		pass: pass
	}, function (findUser__result) {
		
		if (!findUser__result.status) {
			
			//создать пользователя
			usersDB.createUser({
				login: login,
				email: email,
				pass: pass
			},
			function (createUser__result) {

				//создать пространство
				spacesDB.createSpace({
					userId: createUser__result.id,
					date: dateTime().formated,
					space: q.space,
					icon: null
				}, function (createSpace__result) {

					//добавить роль админа в пространство
					spacesDB.createRole({
						spaceId: createSpace__result.id,
						userId: createUser__result.id,
						role: 'admin'
					}, function (createRole) {

						//создать первый чат в пространстве
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

							//добавить пользователя в чат
							chatsDB.addUser({
								chatsId: createChat__result.id,
								usersId: createUser__result.id,
								chatRole: 'admin',
								joinDate: dateTime().formated
							}, callback);
						});
					});
				});
			});
		} else {
			if (callback) callback({
				status: false,
				msg: `Пользователь ${email} не добавлен, уже есть пользователь с такими данными`
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
			msg: (e.affectedRows) ? `Пользователь ${email} добавлен` : `Пользователь ${email} не добавлен`,
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
			msg: (e.length) ? `Данные пользователя id: ${id} загружены` : `Пользователь id: ${id} не найден`
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
	let spaces = def(q.spaces);
	let idStr = arrayToString(spaces);
	
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

//найти чаты в которых у пользователя есть роль
chatsDB.loadChatsByUser = function (q, callback) {
	let userId = def(q.userId);
	
	let query = `SELECT * FROM ${db.chatsRooms} WHERE usersId = "${userId}"`;
	connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.length) ? true : false,
			msg: (e.length) ? `Найдено ${e.length} чатов` : 'Не найдено чатов',
			chatsRooms : e
		});
	});
}

//загрузить чаты по Id
chatsDB.loadChats = function (q, callback) {
	let chatsId = def(q.chatsId);
	let idStr = arrayToString(chatsId);
	
	let query = `SELECT * FROM ${db.chats} WHERE id IN (${idStr})`;
	connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.length) ? true : false,
			msg: (e.length) ? `Найдено ${e.length} чатов` : 'Не найдено чатов',
			chats : e
		});
	});
}

//найти все теги к чату по Id
chatsDB.loadChatTags = function (q, callback) {
	let chatId = def(q.chatId);
	
	let query = `SELECT * FROM ${db.chatsTags} WHERE chatsId = "${chatId}"`;
	connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.length) ? true : false,
			msg: (e.length) ? `Найдено ${e.length} чатов` : 'Не найдено чатов',
			chats : e
		});
	});
}


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

//массив в MYSQL строку
function arrayToString(arr){
	let idArr = []; 
	for (var i = 0; i < arr.length; i++){
		idArr.push(arr[i].id);
	}
	return idArr.join(',').trim();
};

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