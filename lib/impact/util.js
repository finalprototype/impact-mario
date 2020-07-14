ig.module(
	'impact.util'
)
.defines(function(){
	
ig.Util = ig.Class.extend({
	
});

ig.Util.genRan = function(l){  
	var _ran = "";
	var _pool = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";  
	var _tmp;  
	for (var i=0;i<l;i++)  
	{  
		_tmp = Math.floor((Math.random() * 100));  
		var p = _tmp % (_pool.length - 1);  
		_ran += _pool.charAt(p);  
	}  
	return _ran;  
}

ig.Util.randomNumber = function(max,min){
	min = min==undefined?0:min;
	max = max==undefined?9999:max;
	return Math.floor(Math.random() * (max - min + 1) + min);
}

});