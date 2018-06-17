//var socket = io.connect(window.location.href);
var img = ["vide.png", "croix2.png", "rond2.png"];

var smallText = '<table class="morpion"><tbody>';
for (y = 0; y < 3; y ++)
{
	smallText += '<tr>';
	for (x = 0; x < 3; x ++)
		smallText += '<td m="'+ (x+y*3)+'"><img src="' + img[0]+'"></td>';
	smallText += '</tr>';
}
smallText += '</tbody></table>';


var bigText = '<table class="fract"><tbody>';
for (y = 0; y < 3; y ++)
{
	bigText += '<tr>';
	for (x = 0; x < 3; x ++)
		bigText += '<td big="'+(x+y*3)+'">'+smallText+'</td>';
	bigText += '</tr>';
}
bigText += '</tbody></table>';

$("#fract").html(bigText);

var fractapion = new Fractapion();

var mode = "none";

//fractapion.init();

$(".morpion").on("mouseout", "img", function() {
	if ($(this).closest("tr").length > 0)
	{
		var little = $(this).closest("td").attr("m");
		var big = $(this).closest("td").parent().closest("td").attr("big");
		if (mode === "local")
			onMouseOutLocal(big, little);
		else if (mode === "multi")
			onMouseOutMulti(big, little);
	}
});

$(".morpion").on("mouseover", "img", function() {
	if ($(this).closest("tr").length > 0)
	{
		var little = $(this).closest("td").attr("m");
		var big = $(this).closest("td").parent().closest("td").attr("big");
		if (mode === "local")
			onMouseOverLocal(big, little);
		else if (mode === "multi")
			onMouseOverMulti(big, little);
	}
});

$(".morpion").on("click", "img", function() {
	var click;
	if ($(this).closest("tr").length > 0)
	{
		var little = $(this).closest("td").attr("m");
		var big = $(this).closest("td").parent().closest("td").attr("big");
		if (mode === "local")
			onClickLocal(big, little);
		else if (mode === "multi")
			onClickMulti(big, little);
	}

});

function updateGraphique(){
	for (big=0;big<9;big++)
	{
		for (little=0;little<9;little++)
			$(".fract td[big="+big+"] .morpion td[m="+little+"] img").attr("src", img[fractapion.getPion(big, little)+1]);
        if (fractapion.getPionBigBoard(big) === -1)
			$(".fract td[big="+big+"] .imgwin").remove();
		else
		{
			$(".fract td[big="+big+"] ").append("<img src=\""+img[fractapion.getPionBigBoard(big)+1]+"\" class=\"imgwin\">");
		}
	}
	$(".must").removeClass("must");
    if (fractapion.needToPlay !== -1)
		$(".fract td[big="+fractapion.needToPlay+"] table").addClass("must");
}

$(".btnRegles").on("click", function(){
    $("#popupRegles").removeClass("close");
});

$(".ruls .btnClose").on("click", function(){
    $("#popupRegles").addClass("close");
});

$(".localGame").on("click", function(){
	console.log("Local");
	fractapion.reset();
	mode = "local";
	updateGraphique();
    $("#popupMenu").addClass("close");
});

$(".multiGame").on("click", function(){
	console.log("Multi");
	fractapion.reset();
	mode = "multi";
    updateGraphique();
	$(".state").html("Connexion au server...");
	startMultiGame({
		connect: function(){
			console.log("connected");
			$(".state").html("En attente d'un adversaire");
		},
		disconnect: function(){

		},
		friendDisconnect: function(){

		},
		readyToPlay: function(data){
			$(".state").html("Jeux en cours");
			$(".gameId").html("Numero de la partie: "+ data.gameId);
			$(".gameId").css("display", "inherit");
			$(".restart").css("display", "inherit");
			$(".this img").attr("src", img[data.playerId +1]);
            $(".this").css("display", "inherit");
			$(".turn").css("display", "inherit");
			console.log("ready to play, you are " + playerNum);
		},
		newState: function(){
			if (fractapion.playerTurn === playerNum)
				$(".turn").html("À toi de jouer");
			else 
				$(".turn").html("À l'autre de jouer");
			updateGraphique();
		},
		win: function(data){
            if (data.player === playerNum)
				alert("Bravo tu a gagné!");
			else
				alert("Domage tu a perdu ...");
		}
	});
});
