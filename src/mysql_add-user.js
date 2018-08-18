const F = require('../src/mysql-function');
const dateTime = require('../src/date-time');

const usersDB = require('../src/mysql__usersDB');
const chatsDB = require('../src/mysql__chatsDB');
const spacesDB = require('../src/mysql__spacesDB');

//добавляет пользователя в чат и в пространство
//добавляет пользователя в пространство (роль в пространстве)
//добавляет пользователя в чат (роль в чате)


const addUser = function(q, callback) {
	let userId = q.userId;
	let chatId = q.chatId;
	let spaceId = q.spaceId;
	
	spacesDB.insertRoleInToSpace({
		spaceId : spaceId,
		userId : userId,
		role : 'user'
	},function(insertRoleInToSpace__result){
		
		chatsDB.insertUserInToChat({
			chatsId : q.chatId,
			usersId : q.userId,
			chatRole : 'user',
			joinDate : dateTime().formated
		},function(insertUserInToChat__result){
			
			callback({
				status: true,
				msg: `Пользователь id:${userId} добавлен в чат и в пространство`,
				data: {
					userId : userId,
					chatId : chatId,
					spaceId : spaceId,
					spaceRoleId : insertRoleInToSpace__result.data.insertId,
					chatsRoomsId : insertUserInToChat__result.data.insertId
				}
			});
		});
	});
}

module.exports = addUser;