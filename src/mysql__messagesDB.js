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

//загрузить сообщения по id чатов
messagesDB.selectMessagesByChatId = function(q, callback){
	
	let query = Q()
	.SELECT('*')
	.FROM(db.messages)
	.WHERE()
	.IN({
		chatsId : q.chatsId
	}).end();
	
	F.connectToMYSQL(query, function (e) {
		if (callback) callback({
			status: F.status(e.affectedRows),	
			msg: F.msg(e.affectedRows,[`Загружено ${e.length} сообщений`,'Сообщения не загружены']),
			data: e
		});
	});
}

module.exports = messagesDB;