const F = require('../src/mysql-function');
const dateTime = require('../src/date-time');

const usersDB = require('../src/mysql__usersDB');
const spacesDB = require('../src/mysql__spacesDB');

//добавляет пользователя в чат и в пространство
//добавляет пользователя в пространство (роль в пространстве)


const addUser = function(q, callback) {
	let userId = q.userId;
	let spaceId = q.spaceId;
	
	spacesDB.insertRoleInToSpace({
		spaceId : spaceId,
		userId : userId,
		role : 'user'
	},function(insertRoleInToSpace__result){
		
			
			callback({
				status: true,
				msg: `Пользователь id:${userId} добавлен в чат и в пространство`,
				data: {
					userId : userId,
					spaceId : spaceId,
					spaceRoleId : insertRoleInToSpace__result.data.insertId,
					
				}
			});

	});
}

module.exports = addUser;