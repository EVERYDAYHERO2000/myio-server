const F = require('../src/mysql-function');
const dateTime = require('../src/date-time');

const messagesDB = require('../src/mysql__messagesDB');
const tagsDB = require('../src/mysql__tagsDB');
const chatsDB = require('../src/mysql__chatsDB');
const spacesDB = require('../src/mysql__spacesDB');
const usersDB = require('../src/mysql__usersDB');

//Регистрация нового пользователя. 
//Проверка существования пользователя
//создание пользователя
//создание пространства
//создание чата
const registration = function (q, callback) {
	let login = q.login;
	let email = q.email;
	let pass = q.pass;
	let space = q.space;
	
	//
	//есть ли пользователь
	usersDB.selectUser({
		login: login,
		email: email,
		pass: pass
	}, function (selectUser__result) {
		
		if (!selectUser__result.status) {
			
			//
			//создать пользователя
			usersDB.insertNewUser({
				login: login,
				email: email,
				pass: pass
			},
			function (insertNewUser__result) {

				//
				//создать пространство
				spacesDB.insertNewSpace({
					userId: insertNewUser__result.data.insertId,
					date: dateTime().formated,
					space: space,
					icon: null
				}, function (insertNewSpace__result) {

					//
					//добавить роль админа в пространство
					spacesDB.insertRoleInToSpace({
						spaceId: insertNewSpace__result.data.insertId,
						userId: insertNewUser__result.data.insertId,
						role: 'admin'
					}, function (insertRoleInToSpace) {

						//
						//создать первый чат в пространстве
						chatsDB.insertNewChat({
							userId: insertNewUser__result.data.insertId,
							name: 'Instruction',
							icon: null,
							spacesId: insertNewSpace__result.data.insertId,
							creationDate: dateTime().formated,
							taskStatus: 'chat',
							parentId: null,
							deadlineDate: null
						}, function (insertNewChat__result) {

							//
							//добавить пользователя в чат
							chatsDB.insertUserInToChat({
								chatsId: insertNewChat__result.data.insertId,
								usersId: insertNewUser__result.data.insertId,
								chatRole: 'admin',
								joinDate: dateTime().formated
							}, callback);
							
							//
							//установить созданный чат активным
							usersDB.updateActiveChat({
								userId: insertNewUser__result.data.insertId, 
								chatId: insertNewChat__result.data.insertId
							});
							
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

module.exports = registration;