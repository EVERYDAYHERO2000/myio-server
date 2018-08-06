const C = require('../src/config');
const dateTime = require('../src/date-time.js');
const mysql = require('mysql');
const db = C.db;
const F = require('../src/mysql-function');

const messagesDB = require('../src/mysql__messagesDB');
const tagsDB = require('../src/mysql__tagsDB');
const chatsDB = require('../src/mysql__chatsDB');
const spacesDB = require('../src/mysql__spacesDB');
const usersDB = require('../src/mysql__usersDB');

const mysqlQuery = function (e, q, callback) {
	switch (e) {

		case 'login':
			login({
				login: q.login,
				pass: q.pass
			}, callback);
			break;

		case 'registration':
			registration({
				login: q.login,
				email: q.email,
				pass: q.pass,
				space: q.space
			}, callback);
			break;
			
		case 'createNewChat':
			createNewChat({
				email: q.email,
				pass: q.pass,
				author: q.author,
				name: q.name,
				description: q.description,
				date: q.date,
				chatType: q.chatType,
				space: q.space,
				userList: (typeof q.userList == 'string') ? q.userList.split(',') : q.userList
			}, callback);
			break;
			
		case 'addNewUser':
			break;

		case 'getSettings':
			break;

		case 'setSettings':
			break;
		
		case 'loadMessages':
			messagesDB.selectMessages({
				email: q.email,
				pass: q.pass,
				chatsId: (typeof q.chatsId == 'string') ? q.chatsId.split(',') : q.chatsId
			}, callback);
			break;
	}
}

module.exports = mysqlQuery;


//Вход и загрузка необходимого окружения
//найти пользователя
//найти все пространства
//загрузить все пространства
//найти все чаты в которых у пользователя есть роль
//загрузить чаты
//загрузить все теги
//найти всех доступных пользователей
function login (q, callback) {
	let email = q.email;
	let pass = q.pass;
	
	//
	//найти пользователя
	usersDB.selectUser({
		email: email,
		pass: pass
	}, function(selectUser__result){
		
		//
		//найти все пространства в которых у пользователя есть роль
		spacesDB.selectSpacesByUserId({
			useId: selectUser__result.user.id
		},function(selectSpacesByUserId__result){
			
			let spaces = F.collectArray(selectSpacesByUserId__result.spaces, 'spaceId');
			
			//
			//загрузить все пространства пользователя
			spacesDB.selectSpacesById({
				spaces: spaces
			},function(selectSpacesById__result){
				
				//
				//найти все чаты с ролью пользователя
				chatsDB.selectChatsByUser({
					userId: selectUser__result.user.id
				},function(selectChatsByUser__result){
							
					let chatsId = F.collectArray(selectChatsByUser__result.chatsRooms, 'chatsId');
	
					//
					//загрузить чаты пользователя
					chatsDB.selectChatsById({
						chatsId: chatsId
					},function(selectChatsById__result){
						
						//
						//загрузить все теги ко всем чатам
						chatsDB.selectChatTagsById({
							chatsId: chatsId
						},function(selectChatTagsById__result){
							
							//
							//загрузить теги
							tagsDB.selectTagsBySpaceId({
								spaces: spaces
							},function(selectTagsBySpaceId__result){
								
								//
								//id всех доступных пользователей
								chatsDB.selectChatsRoomsById ({
									chatsId : chatsId
								}, function(selectChatsRoomsById__result){
									
									let userList = F.collectArray(selectChatsRoomsById__result.chatsRooms, 'usersId');
									
									//
									//загрузить всех пользователей 
									usersDB.selectUsersById({
										userList : userList
									}, function(selectUsersById__result){
										
										callback({
											status: true,
											msg: `Пользователь ${selectUser__result.user.email} вошёл, данные успешно загружены`,
											data: {
												user: selectUser__result.user,
												spaceRoles: selectSpacesByUserId__result.spaces,
												spaces: selectSpacesById__result.spaces,
												chatsRooms: selectChatsByUser__result.chatsRooms,
												chats: selectChatsById__result.chats,
												tags: selectTagsBySpaceId__result.tags,
												userList: selectUsersById__result.users
											}
										});
									});
								});
							});
						});
					});
				});
			});
		});
	});
}

//Регистрация нового пользователя. 
//Проверка существования пользователя
//создание пользователя
//создание пространства
//создание чата
function registration (q, callback) {
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
					userId: insertNewUser__result.id,
					date: dateTime().formated,
					space: space,
					icon: null
				}, function (insertNewSpace__result) {

					//
					//добавить роль админа в пространство
					spacesDB.insertRoleInToSpace({
						spaceId: insertNewSpace__result.id,
						userId: insertNewUser__result.id,
						role: 'admin'
					}, function (insertRoleInToSpace) {

						//
						//создать первый чат в пространстве
						chatsDB.insertNewChat({
							userId: insertNewUser__result.id,
							name: 'Instruction',
							icon: null,
							spacesId: insertNewSpace__result.id,
							creationDate: dateTime().formated,
							taskStatus: 'chat',
							parentId: null,
							deadlineDate: null
						}, function (insertNewChat__result) {

							//
							//добавить пользователя в чат
							chatsDB.insertUserInToChat({
								chatsId: insertNewChat__result.id,
								usersId: insertNewUser__result.id,
								chatRole: 'admin',
								joinDate: dateTime().formated
							}, callback);
							
							//
							//установить созданный чат активным
							usersDB.updateActiveChat({
								userId: insertNewUser__result.id, 
								chatId: insertNewChat__result.id
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


//создать новый чат, добавить роли
//создать чат
//добавить пользователя в чат
function createNewChat (q, callback){
	let email = q.email;
	let	pass = q.pass;
	let createrId = q.author;
	let name = q.name;
	let description = q.description;
	let date = q.date;
	let space = q.space;		
	let userList = F.arrayToString(q.userList);
	let chatType = q.chatType;
	
	
	//
	//создать чат
	chatsDB.insertNewChat({
		userId: createrId,
		name: name,
		icon: null,
		spacesId: space,
		creationDate: dateTime().formated,
		taskStatus: chatType,
		parentId: null,
		deadlineDate: dateTime(date).formated
	},function(insertNewChat__result){
		
		//
		//добавить пользователя в чат
		chatsDB.insertUserInToChat({
			chatsId: insertNewChat__result.id,
			usersId: createrId,
			chatRole: 'admin',
			joinDate: dateTime().formated
		}, callback );
	});
};