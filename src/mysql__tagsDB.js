var C = require('../src/config');
var F = require('../src/mysql-function');
var dateTime = require('../src/date-time.js');
var db = C.db;

//
//
//
//
// теги
var tagsDB = {};

//загрузить все теги теги пространства
tagsDB.selectTagsBySpaceId = function(q, callback){
	let spaces = q.spaces; // [1,2,3] — id
	let idStr = F.arrayToString(spaces); // "1","2","3"
	
	let query = `SELECT * FROM ${db.tags} WHERE spacesId IN (${idStr})`;
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.affectedRows) ? true : false,	
			msg: (e.affectedRows) ? `Загружено ${e.length} тегов` : 'Теги не загружены',
			tags: e
		});
	});
	
}

module.exports = tagsDB;