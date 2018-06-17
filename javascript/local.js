
function onMouseOutLocal(big, little) {
	if (fractapion.getPion(big, little) == -1 && fractapion.getPionBigBoard(big) == -1)
		$(".fract td[big="+big+"] .morpion td[m="+little+"] img").attr("src", img[0]);
}

function onMouseOverLocal(big, little) {

	if (fractapion.getPion(big, little) == -1 && fractapion.getPionBigBoard(big) == -1)
		$(".fract td[big="+big+"] .morpion td[m="+little+"] img").attr("src", img[fractapion.playerTurn+1]);
}

function onClickLocal(big, little) {
	fractapion.play(big, little, fractapion.playerTurn);
	updateGraphique();
	if (fractapion.winner != -1)
		alert("player " + fractapion.winner + " win the game!!");
}
