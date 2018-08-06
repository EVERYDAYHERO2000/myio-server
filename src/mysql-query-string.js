const F = require('../src/mysql-function');

const query = function(){
	const __this = this;
	
	this.q = '';
	
	//SELECT [*]
	this.SELECT = function(string){
		string = string || '*';
		__this.q = __this.q + 'SELECT ' + string + ' ';
		return __this;
	}
	this.select = this.SELECT;
	
	//FROM [table]
	this.FROM = function(string){
		__this.q = __this.q + 'FROM ' + string + ' ';
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
	this.IN = function(obj){
		for (var key in obj){
			break;
		}
		__this.q = __this.q + key + ' IN (' + F.arrayToString(obj[key]) + ') ';
		return __this;
	}
	this.in = this.IN;
	
	//AND
	this.AND = function(){
		__this.q = __this.q + 'AND '; 
		return __this;
	}
	this.and = this.AND;
	
	//INSERT INTO [table]
	this.INSERT = function(string){
		__this.q = __this.q + 'INSERT INTO ' + string + ' ';
		return __this;
	}
	this.insert = this.INSERT;
	
	//([keys]) VALUES ([values])
	this.VALUES = function(obj){
		let keys = [];
		let values = [];
		for (var key in obj){
			keys.push(key);
			values.push( F.def(obj[key]) );
		}
		
		__this.q = __this.q + '(' + keys.join() + ') VALUES (' + values.join() + ') ';
		return __this;
	}
	this.values = this.VALUES;
	
	//UPDATE [table]
	this.UPDATE = function(string){
		__this.q = __this.q + 'UPDATE ' + string + ' ';
		return __this;
	}
	this.update = this.UPDATE;
	
	//SET [key] = [value]
	this.SET = function(obj){
		for (var key in obj){
			break;
		}
		__this.q = __this.q + 'SET ' + key + ' = ' + F.def(obj[key]) + ' ';
		return __this;
	}
	this.set = this.SET;
	
	this.even = function(obj){
		for (var key in obj){
			break;
		}
		__this.q = __this.q + key + ' = ' + F.def(obj[key]) + ' ';
		return __this;
	}
	
	this.end = function(){
		__this.q = __this.q.trim() + ';';
		return __this.q;
	}
	
	this.done = function(){
		return __this.q;
	}
	
	this.raw = function(string){
		__this.q = __this.q + string + ' ';
		return __this;
	}
	
	return this;
}


module.exports = query;