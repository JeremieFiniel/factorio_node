function Morpion()
{
	this.table = 0;

	this.reset = function()
	{
		this.table = 0;
	}

	this.setPion = function(position, player)
	{
		this.table |= (1+player) << (position*2);
	}


	this.getPion = function(position)
	{
		if (((this.table >> (position*2)) & 0b11) == 0b11)
			return 2;
		if (this.table & (0b01 << (position*2)))
			return 0;
		else if (this.table & (0b10 << (position*2)))
			return 1;
		return -1;
	}

	this.win =function()
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

	this.full = function()
	{
		var i = 0;
		while (i < 9 && ((this.table >> (i*2)) & 0b11))
			i ++;
		return i >= 9;
	}
}

function Fractapion()
{
	this.id = -1;
	this.board = new Array();
	this.table = new Morpion();
	for (i=0;i<9;i++)
		this.board[i] = new Morpion();
	
	console.log("init");
	this.reset = function()
	{
		this.playerTurn = 0;
		this.needToPlay = -1;
		this.winner = -1;

		for (i=0;i<9;i++)
			this.board[i].reset();
		this.table.reset();
	}
	this.reset();

	this.switchPlayer = function()
	{
		this.playerTurn = 1 - this.playerTurn;
	}

	this.setPionBigBoard = function(position)
	{
		this.table.setPion(position, this.playerTurn);
	}

	this.setPion = function(big, little)
	{
		this.board[big].setPion(little, this.playerTurn);
	}

	/*
this.setPionBigBoard = function(position, player)
{
	this.table.setPion(position, player);
}

this.setPion = function(big, little, player)
{
	this.board[big].setPion(little, player);
}
*/

	this.getPionBigBoard = function(position)
	{
		return this.table.getPion(position);
	}

	this.getPion = function(big, little)
	{
		return this.board[big].getPion(little);
	}

	this.winBigBoard = function()
	{
		return this.table.win();
	}

	this.win = function(big)
	{
		return this.board[big].win();
	}

	this.fullBigBoard = function()
	{
		return this.table.full();
	}

	this.full = function(big)
	{
		return this.board[big].full();
	}

	this.toJson = function()
	{
	}

	this.play = function(big, little, player)
	{
		if ((this.needToPlay == -1 && this.getPion(big, little) != -1) || (this.needToPlay != -1 && big != this.needToPlay) || this.getPion(big, little) != -1 || this.getPionBigBoard(big) != -1)
			console.log("Can't play here");
		else
		{
			this.setPion(big, little);

			if (this.win(big) != -1)
			{
				this.setPionBigBoard(big);
				console.log("win morpion "+big);

				if (this.winBigBoard() != -1)
				{
					console.log("player "+ this.playerTurn + " WIN");
					this.winner = this.playerTurn;
				}
			}
			else if (this.full(big))
			{
				//console.log("full");
				this.setPionBigBoard(big);
				this.switchPlayer();
				this.setPionBigBoard(big);
				this.switchPlayer();
			}

			this.switchPlayer();

			if (this.getPionBigBoard(little) == -1)
				this.needToPlay = little;
			else
				this.needToPlay = -1;
			//console.log("need to play at " + this.needToPlay);
		}
	}
}


module.exports.Morpion = Morpion;
module.exports.Fractapion = Fractapion;
