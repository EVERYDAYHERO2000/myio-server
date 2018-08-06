const querystring = require('querystring');
const mysqlQuery = require('../src/mysql-query.js');

const requests = function (method, data, callback) {
	let queryData = querystring.parse(data);

	if (method === 'POST') {	
		mysqlQuery(queryData.eventType, queryData, callback);
	} else if (method === 'GET') {
		
	}
}


module.exports = requests;

