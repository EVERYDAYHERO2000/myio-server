const F = require('../src/mysql-function');
const dateTime = require('../src/date-time');

const chatsDB = require('../src/mysql__chatsDB');

//создать новый чат, добавить роли
//создать чат
//добавить пользователя в чат
const createNewChat = function (q, callback){
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
			chatsId: insertNewChat__result.data.insertId,
			usersId: createrId,
			chatRole: 'admin',
			joinDate: dateTime().formated
		}, function(insertUserInToChat__result){
			
			//загрузить чат
			chatsDB.selectChatsById({
				id: [insertNewChat__result.data.insertId]
			}, function(selectChatsById__result){
				
				//найти роль для чата
				chatsDB.selectChatsRoomsByChatAndUserId({
					usersId : createrId,
					chatsId : insertNewChat__result.data.insertId
				}, function(selectChatsRoomsByChatAndUserId__result){
					callback({
						status : true,
						msg : `Чат создан`,
						data: {
							chats : selectChatsById__result.data,
							chatsRooms : selectChatsRoomsByChatAndUserId__result.data
						}
					});
				});
			});
		});
	});
};

module.exports = createNewChat;