const C = require('../src/config');
const Q = require('../src/mysql-query-string');
const F = require('../src/mysql-function');
const db = C.db;

//
//
//
//
// пространства
const spacesDB = {};

// создать пространство
spacesDB.insertNewSpace = function (q, callback) {
	
	let query = Q()
	.INSERT(db.spaces)
	.VALUES({
		name : q.space,
		spaceCreator : q.userId,
		creationDate : q.date,
		icon : q.icon
	}).end();
	
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: F.status(e.affectedRows),
			msg: F.msg(e.affectedRows,[`Пространство "${space}" добавленно`,'Пространство не добавлено']),
			data: e
		});
	});
}

//создать роль в пространстве
spacesDB.insertRoleInToSpace = function (q, callback) {
	
	let query = Q()
	.INSERT(db.spacesRole)
	.VALUES({
		spaceId : q.spaceId,
		userId : q.userId,
		role : q.role
	}).end();
	
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: F.status(e.affectedRows),
			msg: F.msg(e.affectedRows,[`Роль пользователя id=${q.userId} для пространства добавлена`,'Роль для пространства не добавлена']),
			data: e
		});
	});
}

//найти все пространства в которых у пользователя есть роль
spacesDB.selectSpacesByUserId = function(q, callback) {
	
	let query = Q()
	.SELECT('*')
	.FROM(db.spacesRole)
	.WHERE()
	.even({
		userId : q.userId
	}).end();
	
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: F.status(e.length),
			msg: F.msg(e.length,[`У пользователя есть роли в ${e.length} пространствах`,'У пользователя нет ролей в пространствах']),
			data : e
		});
	});
}

//найти всех пользователей у которых есть роль в пространстве
spacesDB.selectAllUserBySpaceId = function(q, callback) {
	
	let query = Q()
	.SELECT('*')
	.FROM(db.spacesRole)
	.WHERE()
	.IN({
		spaceId : q.spaces
	}).end();
	
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: F.status(e.length),
			msg: F.msg(e.length,[`У пространства ${e.length} пользователей`,'У пространства нет пользователей']),
			data : e
		});
	});
}


//загрузить все пространства пользователя
spacesDB.selectSpacesById = function(q, callback) {
	
	let query = Q()
	.SELECT('*')
	.FROM(db.spaces)
	.WHERE()
	.IN({
		id : q.spaces
	}).end();
	
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: F.status(e.length),
			msg: F.msg(e.length,[`Загружено ${e.length} пространств`,`Не загруженно пространств`]),
			data : e
		});
	});
}


module.exports = spacesDB;