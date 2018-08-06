const F = require('../src/mysql-function');

const query = function(){
	const __this = this;
	
	this.q = '';
	
	//SELECT [*]
	this.SELECT = function(param){
		__this.q = __this.q + 'SELECT ' + param + ' ';
		return __this;
	}
	this.select = this.SELECT;
	
	//FROM [table]
	this.FROM = function(param){
		__this.q = __this.q + 'FROM ' + param + ' ';
		return __this;
	}
	this.from = this.FROM;
	
	//WHERE
	this.WHERE = function(){
		__this.q = __this.q + 'WHERE ';
		return __this;
	}
	this.where = this.WHERE;
	
	//[key] IN [value] 
	this.IN = function(param){
		for (var prop in param){
			break;
		}
		__this.q = __this.q + prop + ' IN (' + param[prop] + ') ';
		return __this;
	}
	this.in = this.IN;
	
	//AND
	this.AND = function(param){
		__this.q = __this.q + 'AND '; 
		return __this;
	}
	this.and = this.AND;
	
	//INSERT INTO [table]
	this.INSERT = function(param){
		__this.q = __this.q + 'INSERT INTO ' + param + ' ';
		return __this;
	}
	this.insert = this.INSERT;
	
	//([keys]) VALUES ([values])
	this.VALUES = function(param){
		let keys = [];
		let values = [];
		for (var prop in param){
			keys.push(prop);
			values.push(param[prop]);
		}
		
		__this.q = __this.q + '(' + keys.join() + ') VALUES (' + values.join() + ') ';
		return __this;
	}
	this.values = this.VALUES;
	
	//UPDATE [table]
	this.UPDATE = function(param){
		__this.q = __this.q + 'UPDATE ' + param + ' ';
		return __this;
	}
	this.update = this.UPDATE;
	
	//SET [key] = [value]
	this.SET = function(param){
		for (var prop in param){
			break;
		}
		__this.q = __this.q + 'SET ' + prop + ' = ' + param[prop] + ' ';
		return __this;
	}
	this.set = this.SET;
	
	this.even = function(param){
		for (var prop in param){
			break;
		}
		__this.q = __this.q + prop + ' = ' + param[prop] + ' ';
		return __this;
	}
	
	this.end = function(){
		__this.q = __this.q.trim() + ';';
		return __this.q;
	}
	
	this.raw = function(param){
		__this.q = __this.q + param + ' ';
		return __this;
	}
	
	return this;
}


module.exports = query;