var C = require('../src/config');
var mysql = require('mysql');

var func = {};

//обертка для переменных в mysql
//null => NULL   1234 => "1234"
func.def = function (v){
	return (v) ? '"' + v + '"' : 'NULL';
}

//массив в MYSQL строку
//[1,2,3] => "1","2","3"
func.arrayToString = function (arr){
	let idArr = []; 
	
	for (var i = 0; i < arr.length; i++){
		if (arr[i]) idArr.push( func.def(arr[i]) );
	}
	return idArr.join(',').trim();
};

//mysql
func.connectToMYSQL = function (query, callback) {
	let connection = mysql.createConnection(C.mysql);
	connection.connect(function (err) {

		if (err) throw err;
		connection.query(query, function (err, result, fields) {
			if (err) throw err;
			if (callback) callback(result);
		});
		connection.end();
	});
}

//удалить из массива пустые элементы
//[,,3,] => [3]
func.cleanArray = function (actual) {
  let newArray = new Array();
  for (var i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

//mysql AND массив в строку
//["1","2","3"] => "1" AND "2" AND "3"
func.queryValueToString = function (arr){
	return func.cleanArray(arr).join(" AND ");
}

//собрать массив из значений
func.collectArray = function (arr, key){
	let userList = new Array();
	let arrLength = arr.length;
	for (var i = 0; i < arrLength; i++ ){
		userList.push(arr[i][key]);
	}
	return userList;
}

module.exports = func;