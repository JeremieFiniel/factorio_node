var T2d = function(p){
	this.table = new Array(3);
	for (var i = 0; i < 3; i ++)
		this.table[i] = new Array(3);
}

T2d.prototype.get = function(x, y) {
	return this.table[x][y];
}

T2d.prototype.set = function(x, y, o) {
	this.table[x][y] = o;
}

T2d.prototype.reset = function(x, y) {
	for (var i = 0; i < 3; i ++)
		for (var j = 0; j < 3; j ++)
			this.set(i, j, 0);
}

var Fract = function(p) {
	this.ref = new T2d();
	
	if (p > 1)
	{
		this.child = new T2d();
		for (var i = 0; i < 3; i ++)
			for (var j = 0; j < 3; j ++)
				this.child.set(i, j, new Fract(p-1));
	}
}

Fract.prototype.get = function(t) {
	if (typeof(t.child) != 'undefined')
		return this.child.get(t.child);
	
	return this.getRef(t.x, t.y);
}

Fract.prototype.getRef = function(x, y) {
	return this.ref.get(x, y);
}

Fract.prototype.set = function(t, v) {
	if (typeof(t.child) == 'undefined')
		this.setRef(t.x, t.y, v);
	else
		this.child.get(t.x, t.y).set(t.child);
}

Fract.prototype.setRef = function(x, y, v) {
	if (typeof(v) == 'undefined')
		this.ref.set(x, y, 1);
	else
		this.ref.set(x, y, v);
}

Fract.prototype.reset = function(x, y) {
	this.ref.reset();
	if (typeof(this.child) != 'undefined')
		for (var i = 0; i < 3; i ++)
			for (var j = 0; j < 3; j ++)
				this.child.get(i, j).reset();
}

module.exports.Fract = Fract;
module.exports.T2d = T2d;
