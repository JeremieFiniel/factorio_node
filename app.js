var express = require('express'),
    app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	Fractapion = require("./morpion2.js").Fractapion;

app.use(express.static(__dirname));
app.use(express.static(__dirname+"/images"));

app.get('/', function(req, res) {
	res.render('index.ejs');
});

var player = new Array();
var waiting = new Array();

var games = new Array();
var gameIds = 1;

io.sockets.on("connection", function(socket) {
	console.log("new client");
	player.push(socket);
	socket.fract = new Fractapion();
	socket.state = "connected";
	socket.on("newMultiGame", function(){
		if (waiting.length > 0)
		{
			socket.contre = waiting[0];
			socket.contre.contre = socket;
			waiting.shift();

			socket.fract.id = gameIds++;
			socket.fract.reset();
			socket.emit("readyToPlay", {playerId : 0, gameId: socket.fract.id});
			socket.playerID = 0;
			socket.state = "play";

			socket.contre.fract = socket.fract;
			socket.contre.emit("readyToPlay", {playerId: 1, gameId: socket.fract.id});
			socket.contre.playerID = 1;
			socket.contre.state = "play";

			console.log("Create parti");

			socket.emit("newState", socket.fract);
			socket.contre.emit("newState", socket.fract);
		}
		else
		{
			waiting.push(socket);
			socket.emit("waitPlayer");
			socket.state = "wait";
		}
	});

	socket.on("search_random", function(){
		waiting.push(socket);
	});

	socket.on("search_friend", function(id){

	});

	socket.on("play", function(pos){
		console.log("Player " + socket.playerID + " play");
		if (socket.fract.playerTurn == socket.playerID)
		{
			socket.fract.play(pos.big, pos.little, socket.playerID);
			socket.contre.emit("newState", socket.fract);
			socket.emit("newState", socket.fract);
			if (socket.fract.winner != -1)
			{
				socket.contre.emit("win", socket.fract.winner);
				socket.emit("win", socket.fract.winner);
			}
		}
		else
			socket.emit("newState", socket.fract);
	});

	socket.on("close", function(){
		console.log("Disconnection");
		switch (socket.state)
		{
			case "connected":
				break;
			case "wait":
				waiting.splice(waiting.indexOf(socket), 1);
				break;
			case "play":
				socket.contre.emit("friendDisconnect");
				break;
		}
		player.splice(player.indexOf(socket), 1);
	});
});
server.listen(8000);
