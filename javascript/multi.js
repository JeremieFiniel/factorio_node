var playerNum = -1;
var socket=io(window.location.href, {autoConnect:false});
var callBack;

var startMultiGame = function(data){
	console.log("connection");
	callBack = data;
	socket.connect();
}

socket.on('connect', function(){
	if (typeof callBack.connect == "function")
		callBack.connect();
	if (mode === "multi")
		if (fractapion.id == -1)
			socket.emit("newMultiGame");
});

socket.on("friendDisconnect", function(){
	if (typeof callBack.friendDisconnect == "function")
		callBack.friendDisconnect();
});

socket.on("waitPlayer", function(msg){
	playerNum = -1;
});

socket.on("readyToPlay", function(data){
	playerNum = data.playerId;
	fractapion.id = data.gameId;
	fractapion.reset();
	if (typeof callBack.readyToPlay == "function")
		callBack.readyToPlay(data);
});

socket.on("newState", function(fract){
	for (i=0;i<9;i++)
		fractapion.board[i].table = fract.board[i].table;

	fractapion.needToPlay = fract.needToPlay;
	fractapion.playerTurn = fract.playerTurn;
	fractapion.table.table = fract.table.table;
	if (typeof callBack.newState == "function")
		callBack.newState();
});

socket.on("win", function(player){
	if (typeof callBack.win == "function")
		callBack.win({player: player});
});

function onMouseOutMulti(big, little) {
	if (playerNum != -1 && playerNum == fractapion.playerTurn)
		if (fractapion.getPion(big, little) == -1 && fractapion.getPionBigBoard(big) == -1)
			$(".fract td[big="+big+"] .morpion td[m="+little+"] img").attr("src", img[0]);
}

function onMouseOverMulti(big, little) {
	if (playerNum != -1 && playerNum == fractapion.playerTurn)
		if (fractapion.getPion(big, little) == -1 && fractapion.getPionBigBoard(big) == -1)
			$(".fract td[big="+big+"] .morpion td[m="+little+"] img").attr("src", img[playerNum+1]);
}

function onClickMulti(big, little) {
	//console.log("click at " + big + " " + little);
	socket.emit("play", {big: big, little: little});
}
