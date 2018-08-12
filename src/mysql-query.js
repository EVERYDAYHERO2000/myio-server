const messagesDB = require('../src/mysql__messagesDB');
const tagsDB = require('../src/mysql__tagsDB');
const chatsDB = require('../src/mysql__chatsDB');
const spacesDB = require('../src/mysql__spacesDB');
const usersDB = require('../src/mysql__usersDB');

const login = require('../src/mysql_login');
const registration = require('../src/mysql_registration');
const createNewChat = require('../src/mysql_create-new-chat');

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
		
		case 'setChatActive':
			usersDB.updateActiveChat({
				userId: q.userId,
				chatId: q.chatId
			}, callback);
			break;
		
		case 'setChatPinned':
			chatsDB.updateChatsRoomsPinByUserId({
				userId: q.userId,
				chatId: q.chatId,
				isPinned: q.isPinned
			},callback);
			break;
			
		case 'addNewUser':
			break;

		case 'getSettings':
			break;

		case 'setSettings':
			break;
		
		case 'loadMessages':
			messagesDB.selectMessagesByChatId({
				email: q.email,
				pass: q.pass,
				chatsId: (typeof q.chatsId == 'string') ? q.chatsId.split(',') : q.chatsId
			}, callback);
			break;
	}
}

module.exports = mysqlQuery;
