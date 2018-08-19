const F = require('../src/mysql-function');

const tagsDB = require('../src/mysql__tagsDB');
const chatsDB = require('../src/mysql__chatsDB');
const spacesDB = require('../src/mysql__spacesDB');
const usersDB = require('../src/mysql__usersDB');

//Вход и загрузка необходимого окружения
//найти пользователя
//найти все пространства
//загрузить все пространства
//найти все чаты в которых у пользователя есть роль
//загрузить чаты
//загрузить все теги
//найти всех доступных пользователей

const login = function (q, callback) {
	let email = q.email;
	let pass = q.pass;

	//
	//найти пользователя
	usersDB.selectUser({
		email: email,
		pass: pass
	}, function (selectUser__result) {

		//
		//найти все пространства в которых у пользователя есть роль
		spacesDB.selectSpacesByUserId({
			userId: selectUser__result.data.id
		}, function (selectSpacesByUserId__result) {

			let spaces = F.collectArray(selectSpacesByUserId__result.data, 'spaceId');

			//
			//загрузить все пространства пользователя
			spacesDB.selectSpacesById({
				spaces: spaces
			}, function (selectSpacesById__result) {

				//найти все роли в пространстве (все пользователи)
				spacesDB.selectAllUserBySpaceId({
					spaces: spaces
				}, function (selectAllUserBySpaceId__result) {

					//
					//найти все чаты с ролью пользователя
					chatsDB.selectChatsByUser({
						usersId: selectUser__result.data.id
					}, function (selectChatsByUser__result) {

						let chatsId = F.collectArray(selectChatsByUser__result.data, 'chatsId');

						//
						//загрузить чаты пользователя
						chatsDB.selectChatsById({
							id: chatsId
						}, function (selectChatsById__result) {

							//
							//загрузить все теги ко всем чатам
							chatsDB.selectChatTagsById({
								chatsId: chatsId
							}, function (selectChatTagsById__result) {

								//
								//загрузить теги
								tagsDB.selectTagsBySpaceId({
									spaces: spaces
								}, function (selectTagsBySpaceId__result) {

									//
									//id всех доступных пользователей
									chatsDB.selectChatsRoomsById({
										chatsId: chatsId
									}, function (selectChatsRoomsById__result) {

										let ul_1 = F.collectArray(selectChatsRoomsById__result.data, 'usersId'),
											ul_2 = F.collectArray(selectAllUserBySpaceId__result.data, 'userId');
										let userList = F.unique([].concat(ul_1, ul_2));

										//
										//загрузить всех пользователей 
										usersDB.selectUsersById({
											userList: userList
										}, function (selectUsersById__result) {

											callback({
												status: true,
												msg: `Пользователь ${selectUser__result.data.email} вошёл, данные успешно загружены`,
												data: {
													user: selectUser__result.data,
													spaceRoles: selectSpacesByUserId__result.data,
													spaces: selectSpacesById__result.data,
													chatsRooms: selectChatsByUser__result.data,
													chats: selectChatsById__result.data,
													tags: selectTagsBySpaceId__result.data,
													userList: selectUsersById__result.data,
													messages: []
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
	});
}

module.exports = login;