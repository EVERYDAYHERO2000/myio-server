var querystring = require('querystring');
var config = require('../src/config');
var mysql = require('mysql');

var requests = function (method, data, callback) {
	var queryData = querystring.parse(data);

	if (method === 'POST') {
		switch (queryData.eventType) {
			case 'login':
				//console.log('registration',  queryData);

				let query = `SELECT * FROM Users WHERE email = "${queryData.email}" AND password = "${queryData.pass}"`;
				connectToMYSQL(query, function (e) {
					let status = (e.length) ? true : false;
					if (callback) callback({
						status: status
					});
				});

				break;   

			case 'registration':
				console.log('registration', queryData);
				break;
		}
	}
}

module.exports = requests;

//mysql
function connectToMYSQL(query, callback) {
	var connection = mysql.createConnection(config.mysql);
	connection.connect(function (err) {

		if (err) throw err;
		connection.query(query, function (err, result, fields) {
			if (err) throw err;
			if (callback) callback(result);
		});
	}); 
}