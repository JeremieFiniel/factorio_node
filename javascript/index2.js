function createTable(p, $t) {
	if (typeof($t) == 'undefined')
		$t = $(".morpion");

	if (p > 0)
	{
		var $ta = $("<table class='stage"+p+"'></table>");

		for (var i = 0; i < 3; i ++)
		{
			var $tr = $("<tr id='"+i+"'></tr>");
			for (var j = 0; j < 3; j ++)
			{
				var $td = $("<td id='"+j+"'></td>");
				createTable(p-1, $td);
				$td.appendTo($tr);
			}
			$tr.appendTo($ta);
		}
		$ta.appendTo($t);
	}
	else
		$("<img src='"+img[0]+"'/>").appendTo($t);
}

function clearTable() {
	$(".morpion img").each(function() {
		$(this).attr("src", img[0]);
	});
}

function showTable() {
	$(".stage2 > tbody > tr").velocity("transition.slideUpIn", {duration: 1000, stagger: 200});
}

function hideTable() {
	$(".stage2 > tbody > tr").velocity("transition.slideDownOut", {duration: 1000, stagger: 200, backwards: true});
}

var connection = function() {
	var p = $(".connection .pseudo").val();
	if (p != "")
	{
		$(".connection .pseudo").prop("disabled", true);
		socket.emit("con", p);
	}
	else
	{
		$(".connection p").velocity("callout.shake");
		//$(".connection .invalide").show().delay(1000).fadeOut("slow");
	}
	
	return false;
}

var setTurn = function(t) {
	turn = t;
	if (turn)
		$(".turn").text("A vous de jouer");
	else
		$(".turn").text("A " + advPseudo + " de jouer");
}

function setBox(c, pos, $t) {
	if ($t == undefined)
		$t = $(".morpion > table");
	if (pos.child == undefined)
	{
		//$t.find('img').attr("src", img[c]);
		$t.find("> tbody > tr#"+pos.y+" > td#"+pos.x+" img").hide().attr("src", img[c]).velocity("transition.flipBounceXIn");
		$(".wait").removeClass("wait").velocity({scale: 1}, {duration: 200});
		
	}
	else
		setBox(c, pos.child, $t.find("> tbody > tr#"+pos.y+" > td#"+pos.x+" > table"));
}

function setMust(m, $t) {
	if ($t == undefined)
	{
		$t = $(".morpion > table");
		must = m;
	}

	if (m.child == undefined)
	{
		//$t.find('img').attr("src", img[c]);
		$t.find("> tbody > tr#"+m.y+" > td#"+m.x).addClass("must").css("zIndex", 100).velocity({scale: 1.1, boxShadowBlur: 15, boxShadowColor: "#28D05A", boxShadowX: 10, boxShadowY: 10}, {duration: 500});
	}
	else
		setMust(m.child, $t.find("> tbody > tr#"+pos.y+" > td#"+pos.x+" > table"));
}

function clearMust() {
	$(".must").removeClass("must").velocity({scale: 1, boxShadowBlur: 0}, {duration: 500});
}


var setWinMorp = function(pos, vect) {
	$win = $("[fy='"+pos[0][1]+"'] [fx='"+pos[0][0]+"'] .morpion");
	for (var i = 0; i < 3; i ++)
	{
		var x = (pos[1][0]+vect[0]*i)%3;
		var y = (pos[1][1]+vect[1]*i)%3;
		$win.find("[my='"+y+"'] [mx='"+x+"']").addClass("win");
	}

	$win.find(".win").css("box-shadow", "#28D05A 0 0 0 0").velocity({boxShadowBlur:0, borderColorAlpha:0}, {duration: 500})
		.velocity({boxShadowBlur:15, borderColorAlpha:1, borderColor:"#28D05A"}, {duration: 500});

	$win.find("td:not(.win)").css("box-shadow", "none").velocity({borderColorAlpha:0}, {duration: 500})
			.velocity({borderColorAlpha:1, borderColor:"#28D05A"}, {duration: 500});

	$win.find(".win").velocity("callout.bounce", {stagger:50});
}

/*
var setMust = function(m) {
	must = m;
	$(".must").velocity({scale:1, boxShadowBlur:0, borderColorAlpha:0}, {duration: 500}).removeClass("must");

	if (must != undefined)
		$("[fy='"+must[1]+"'] [fx='"+must[0]+"'] .morpion").velocity({scale:1.04, boxShadowBlur:10, borderColorAlpha:1}, {duration: 500}).addClass("must");
}
*/

function canPlay(m, t){
	if (m == undefined)
		return true;
	else if (m.x == t.x && m.y == t.y)
		return canPlay(m.child, t.child);
	else
		return false;
}

function setInfo(info, pos, tab, $t, cB){
	if ($t == undefined)
		$t = $(".morpion > table");
	
	if (tab == undefined)
		tab = table;

	if (pos.child == undefined)
	{
		if (info != undefined)
		{
			if (info.win != undefined)
			{
				for (var i = 0; i < 3; i ++)
				{
					$t.velocity("transition.flipBounceXIn").velocity({boxShadowBlur: 15, boxShadowColor: "#28D05A", boxShadowX: 5, boxShadoxY: 5}, {duration: 200});
				}	

			}
			else if (info.finish != undefined)
			{

			}
		}
	}
	else
	{
		setInfo(info, pos.child, tab.child.get(pos.x, pos.y), $t.find("> tbody > tr#"+pos.y+" > td#"+pos.x+" > table"), function(info) {
			if (info.win != undefined)
			{
				tab.setRef(pos.x, pos.y, 1);
				$t.find("> tbody > tr#"+pos.y+" > td#"+pos.x).velocity({boxShadowBlur: 15, boxShadowColor: "#28D05A", boxShadowX: 5, boxShadoxY: 5}, {duration: 200});

		});


}

