const F = require('../src/mysql-function');

const query = function(){
	const __this = this;
	
	this.q = '';
	
	function concat(arr){
		this.str = __this.q + ' ' + arr.join(' ');
		return str;
	}
	
	function brackets(str){
		return '(' + str + ')'
	}
	
	//SELECT [*]
	this.SELECT = function(string){
		string = string || '*';
		__this.q = concat(['SELECT', string]);
		return __this;
	}
	this.select = this.SELECT;
	
	//FROM [table]
	this.FROM = function(string){
		__this.q = concat(['FROM', string]);
		return __this;
	}
	this.from = this.FROM;
	
	//WHERE
	this.WHERE = function(){
		__this.q = concat(['WHERE']);
		return __this;
	}
	this.where = this.WHERE;
	
	//[key] IN [value] 
	this.IN = function(obj){
		for (var key in obj){
			break;
		}
		let list = F.arrayToString(obj[key]);
		
		__this.q = concat([key, 'IN', brackets(list)]);
		return __this;
	}
	this.in = this.IN;
	
	//AND
	this.AND = function(){
		__this.q = concat(['AND']);
		return __this;
	}
	this.and = this.AND;
	
	//INSERT INTO [table]
	this.INSERT = function(string){
		__this.q = concat(['INSERT', 'INTO', string]);
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
		
		__this.q = concat([brackets(keys.join()), 'VALUES', brackets(values.join()) ]);
		return __this;
	}
	this.values = this.VALUES;
	
	//UPDATE [table]
	this.UPDATE = function(string){
		__this.q = concat(['UPDATE', string]);
		return __this;
	}
	this.update = this.UPDATE;
	
	//SET [key] = [value]
	this.SET = function(obj){
		for (var key in obj){
			break;
		}
		__this.q = concat(['SET', key, '=', F.def(obj[key])]);
		return __this;
	}
	this.set = this.SET;
	
	this.math = function(obj,operator){
		for (var key in obj){
			break;
		}
		__this.q = concat([key, operator, F.def(obj[key])]);
		return __this;
	}
	
	this.even = function(obj){
		return __this.math(obj,'=');
	}
	
	this.more = function(obj){
		return __this.math(obj,'>');
	}
	
	this.less = function(obj){
		return __this.math(obj,'<');
	}
	
	this.end = function(){
		__this.q = concat([';']);
		return __this.q;
	}
	
	this.next = function(){
		__this.q = concat([';']);
		return __this;
	}
	
	this.done = function(){
		return __this.q;
	}
	
	this.raw = function(string){
		__this.q = concat([string]);
		return __this;
	}
	
	return this;
}


module.exports = query;