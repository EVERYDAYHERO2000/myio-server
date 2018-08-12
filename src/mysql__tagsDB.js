const C = require('../src/config');
const Q = require('../src/mysql-query-string');
const F = require('../src/mysql-function');
const db = C.db;

//
//
//
//
// теги
const tagsDB = {};

//загрузить все теги теги пространства
tagsDB.selectTagsBySpaceId = function(q, callback){
	
	let query = Q()
	.SELECT('*')
	.FROM(db.tags)
	.WHERE()
	.IN({
		spacesId : q.spaces
	}).end();
	
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: F.status(e.affectedRows),	
			msg: F.msg(e.affectedRows,[`Загружено ${e.length} тегов`,'Теги не загружены']),
			data: e
		});
	});
	
}

module.exports = tagsDB;