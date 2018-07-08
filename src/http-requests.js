var querystring = require('querystring');
var mysqlQuery = require('../src/mysql-query.js');

var requests = function (method, data, callback) {
	let queryData = querystring.parse(data);

	if (method === 'POST') {	
		mysqlQuery(queryData.eventType, queryData, callback);
	} else if (method === 'GET') {
		
	}
}


module.exports = requests;

