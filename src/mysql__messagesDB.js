const C = require('../src/config');
const Q = require('../src/mysql-query-string');
const F = require('../src/mysql-function');
const db = C.db;


//
//
//
//
// сообщения
const messagesDB = {};

//загрузить сообщения
messagesDB.selectMessages = function(q, callback){
	
	let query = Q()
	.SELECT('*')
	.FROM(db.messages)
	.WHERE()
	.IN({
		chatsId : q.chatsId
	}).end();
	
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: (e.affectedRows) ? true : false,	
			msg: (e.affectedRows) ? `Загружено ${e.length} сообщений` : 'Сообщения не загружены',
			messages: e
		});
	});
}

module.exports = messagesDB;