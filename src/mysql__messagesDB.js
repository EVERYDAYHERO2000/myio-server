var C = require('../src/config');
var F = require('../src/mysql-function');
var dateTime = require('../src/date-time.js');
var db = C.db;


//
//
//
//
// сообщения
var messagesDB = {};

//загрузить сообщения
messagesDB.selectMessages = function(q, callback){
	let chatsId = q.chatsId; // [1,2,3] — id
	let idStr = F.arrayToString(chatsId); // "1","2","3"
	
	let query = `SELECT * FROM ${db.messages} WHERE chatsId IN (${idStr})`;
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.affectedRows) ? true : false,	
			msg: (e.affectedRows) ? `Загружено ${e.length} сообщений` : 'Сообщения не загружены',
			messages: e
		});
	});
}

module.exports = messagesDB;