const F = require('../src/mysql-function');

const usersDB = require('../src/mysql__usersDB');

//ищет пользователя по email
//возвращает объект профиля без пароля и настроек

const findUser = function(q, callback) {
	let email = q.email;
	
	//
	//найти пользователя
	usersDB.selectUser({
		email: email
	}, function(selectUser__result){
		
			if (selectUser__result.status){
				callback({
					status: true,
					msg: `Пользователь ${selectUser__result.data.email} найден, данные успешно загружены`,
					data: {
						id : selectUser__result.data.id,
						email : selectUser__result.data.email,
						login : selectUser__result.data.login,
						avatar : selectUser__result.data.avatar,
						lastSessionDate : selectUser__result.data.lastSessionDate,
						registerDate : selectUser__result.data.registerDate,
						firstName : selectUser__result.data.firstName,
						lastName : selectUser__result.data.lastName
					}
				});
			} else {
				callback(selectUser__result);
			}
	});
}

module.exports = findUser;