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
	let userId = F.def(q.userId);
	let space = F.def(q.space);
	let date = F.def(q.date);
	let icon = F.def(q.icon);
	
	//let query = `INSERT INTO ${db.spaces} (name, spaceCreator, creationDate, icon) VALUES (${space}, ${userId}, ${date}, ${icon});`;
	let query = Q().INSERT(db.spaces).VALUES({
		name : space,
		spaceCreator : userId,
		creationDate : date,
		icon : icon
	}).end();
	
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.affectedRows) ? true : false,
			msg: (e.affectedRows) ? `Пространство "${space}" добавленно` : 'Пространство не добавлено',
			id: e.insertId
		});
	});
}

//создать роль в пространстве
spacesDB.insertRoleInToSpace = function (q, callback) {
	let spaceId = F.def(q.spaceId);
	let userId = F.def(q.userId);
	let role = F.def(q.role);
	
	//let query = `INSERT INTO ${db.spacesRole} (spaceId, userId, role) VALUES ( ${spaceId}, ${userId}, ${role} );`;
	let query = Q().INSERT(db.spacesRole).VALUES({
		spaceId : spaceId,
		userId : userId,
		role : role
	}).end();
	
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.affectedRows) ? true : false,
			msg: (e.affectedRows) ? `Роль пользователя id=${userId} для пространства добавлена` : 'Роль для пространства не добавлена'
		});
	});
}

//найти все пространства в которых у пользователя есть роль
spacesDB.selectSpacesByUserId = function(q, callback) {
	let userId = F.def(q.useId);
	
	//let query = `SELECT * FROM ${db.spacesRole} WHERE userId = ${userId};`;
	let query = Q().SELECT('*').FROM(db.spacesRole).WHERE().even({userId : userId}).end();
	
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.length) ? true : false,
			msg: (e.length) ? `У пользователя есть роли в ${e.length} пространствах` : 'У пользователя нет ролей в пространствах',
			spaces : e
		});
	});
}

//загрузить все пространства пользователя
spacesDB.selectSpacesById = function(q, callback) {
	let spaces = q.spaces;
	let idStr = F.arrayToString(spaces);
	
	//let query = `SELECT * FROM ${db.spaces} WHERE id IN (${idStr});`;
	let query = Q().SELECT('*').FROM(db.spaces).WHERE().IN({id : idStr}).end();
	
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.length) ? true : false,
			msg: (e.length) ? `Загружено ${e.length} пространств` : `Не загруженно пространств`,
			spaces : e
		});
	});
}


module.exports = spacesDB;