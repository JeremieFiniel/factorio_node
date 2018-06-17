var Morpion = function()
{
	this.table = 0;
}


Morpion.init = function(){
	this.table = 0;
}


Morpion.setPion = function(position, player)
{
	this.table |= (1+player) << (position*2);
}


Morpion.getPion = function(position)
{
	if (((this.table >> (position*2)) & 0b11) == 0b11)
		return 2;
	if (this.table & (0b01 << (position*2)))
		return 0;
	else if (this.table & (0b10 << (position*2)))
		return 1;
	return -1;
}

Morpion.win =function()
{
	if ((this.table & 0b010101) == 0b010101 ||
		(this.table & 0b010101000000) == 0b010101000000 ||
		(this.table & 0b010101000000000000) == 0b010101000000000000 ||
		(this.table & 0b01000001000001) == 0b01000001000001 ||
		(this.table & 0b0100000100000100) == 0b0100000100000100 ||
		(this.table & 0b010000010000010000) == 0b010000010000010000 ||
		(this.table & 0b010000000100000001) == 0b010000000100000001 ||
		(this.table & 0b000001000100010000) == 0b000001000100010000 )
		return 0;
	else if ((this.table & 0b0101010) == 0b0101010 ||
		(this.table & 0b0101010000000) == 0b0101010000000 ||
		(this.table & 0b0101010000000000000) == 0b0101010000000000000 ||
		(this.table & 0b010000010000010) == 0b010000010000010 ||
		(this.table & 0b01000001000001000) == 0b01000001000001000 ||
		(this.table & 0b0100000100000100000) == 0b0100000100000100000 ||
		(this.table & 0b0100000001000000010) == 0b0100000001000000010 ||
		(this.table & 0b0000010001000100000) == 0b0000010001000100000 )
		return 1;
	else 
		return -1;
}

Morpion.full = function()
{
	var i = 0;
	while (i < 9 && ((table >> (i*2)) & 0b11))
		i ++;
	return i >= 9;
}

var Fractapion = function()
{
}

Fractapion.init = function()
{
	this.playerTurn = 0;
	this.board = new Array();
	this.table = Morpion;
	this.table.init();
	for (i=0;i<9;i++)
	{
		this.board[i] = Morpion;
		this.board[i].init();
	}
}

Fractapion.switchPlayer = function()
{
	this.playerTurn = 1 - this.playerTurn;
}

Fractapion.setPionBigBoard = function(position)
{
	this.table.setPion(position, this.playerTurn);
}

Fractapion.setPion = function(big, little)
{
	this.board[big].setPion(little, this.playerTurn);
	console.log("coucou");
}

/*
Fractapion.setPionBigBoard = function(position, player)
{
	this.table.setPion(position, player);
}

Fractapion.setPion = function(big, little, player)
{
	this.board[big].setPion(little, player);
}
*/

Fractapion.getPionBigBoard = function(position)
{
	return this.table.getPion(position);
}

Fractapion.getPion = function(big, little)
{
	return this.board[big].getPion(little);
}

Fractapion.winBigBoard = function()
{
	return this.table.win;
}

Fractapion.win = function(big)
{
	return this.board[big].win;
}

Fractapion.fullBigBoard = function()
{
	return this.table.full;
}

Fractapion.full = function(big)
{
	return this.board[big].full;
}


module.exports.Morpion = Morpion;
module.exports.Fractapion = Fractapion;
