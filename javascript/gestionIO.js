socket.on("valid", function() {
	console.log("valid");
	$(".game .pseudo").text($(".connection .pseudo").val());
	$(".connection").hide();
	$(".game").show();
	$(".state").text("En attente d'un adversaire");
	$(".restart").hide();
	$(".this").hide();
	$(".turn").hide();
	$(".info").hide();
	showTable();
	table.reset();
});

socket.on("invalid", function(fx, fy, mx, my) {
	//$(".connection .pseudo").prop("disabled", false);
	//$(".connection .invalide").show().delay(1000).fadeOut("slow");

	console.log("invalide");
	/*
	table[fx][fy][mx][my] = 0;
	setBox(0, fx, fy, mx, my);
	*/
	turn = true;

});

socket.on("startPlay", function(p, c, s) {
	console.log("start play");
	advPseudo = p;
	color = c;
	must = undefined;
	setTurn(s);

	$(".state").text("Vous jouez contre " + p);
	$(".this img").attr("src", img[c]);
	$(".this").show();
	$(".turn").show();
	clearTable();
	table.reset();
});

socket.on("advDisco", function() {
	turn = false;
	$(".info").text(advPseudo + " c'est déconnecté").show();
	$(".state").text("En attente d'un adversaire");
	$(".turn").hide();
});

socket.on("play", function(t, msg) {
	console.log("play:");
	console.log(t);
	console.log(msg);
	setBox(msg.color, msg.pos);
	//setBox(msg.color, msg.pos[0][0], msg.pos[0][1], msg.pos[1][0], msg.pos[1][1]);

	/*
	if (msg.winMorp != undefined)
		setWinMorp(msg.pos, msg.winMorp);
	if (msg.win != undefined)
		setWin(msg.win);
	if (msg.finishMorp != undefined)
		setFinishMorp();
	if (msg.finish != undefined)
		setFinish();
	*/


	clearMust();
	setInfo(msg.info, msg.pos);
	setMust(msg.must);
	setTurn(t);
});
