var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var backCtx = document.getElementById("back").getContext("2d");
var ut = new Util();
var board = new Board(backCtx, canvas);

var gameStarted = false;

canvas.onmousemove = function(e){
	if(gameStarted){
		board.cursor.final = ut.getMousePos(canvas, e, board);			
	}
}

canvas.onmousedown = function(e){
	if(gameStarted){
		board.cursor.initial = ut.getMousePos(canvas, e, board);
		if(board.striker.checkPoint(board.cursor.initial)){ //check if mouse is inside the board.striker
						
		}

		// for(var i=0; i<board.gattis.length; i++){
		// 	if(board.gattis[i].checkPoint(board.cursor.initial)){
		// 		console.log(board.gattis[i].velocity.x.toFixed(1) + " " + board.gattis[i].velocity.y.toFixed(1));
		// 	}
		// }
	}	
}

canvas.onmouseup = function(e){	
	if(gameStarted){
		if(board.target.flag && board.state === "second"){
			var power = board.target.determinePower(board.cursor.final, board.striker.pos);
			board.striker.strike(power.x, power.y);	
			board.state = "third";	
		}
		board.target.flag = false;

		if(board.state === "first"){
			var flag = true;
			for(var i=1; i<board.gattis.length; i++){
				if(ut.checkCirCollission(board.striker, board.gattis[i])){
					flag = false;
					break;	
				} 				
			}
			if(flag){
				board.state = "second";
				board.target.flag = true;
			}
			
		}	
	}	
}

function start(){
	//board
	board.init();
	board.draw();	
	board.arrangeGattis(ctx, board.gattis);	
	update();
}

function update(){
	//clear
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//draw board.gattis
	for(var length = board.gattis.length, i = length-1; i>=0; i--){
		var g = board.gattis[i];
		if(board.state !== "first"){
			g.checkCollission(board.gattis, canvas);
			g.checkBoundary(canvas);
			g.checkInHoles(board.holes, board.gattis);
		}		
		g.draw(ctx);		
	}	

	//draw target
	if(board.target.flag && board.state === "second"){
		board.target.draw(ctx, board.striker, board.cursor);
	}

	//check and execute board state
	if(board.state === "first"){
		var x = board.cursor.final.x;
		var y = board.cursor.final.y;
		var start, end;
		var unit = 60;
		start = unit, end = canvas.width-unit;
		if(x > start && x < end){
			board.striker.pos.x = x;
			board.striker.pos.y = unit;
			if(board.turn === "bottom") board.striker.pos.y = canvas.height - unit;
		}
	}	

	//check if gattis stopped
	else if(board.state === "third"){
		var flag = true;
		for(var i=0; i<board.gattis.length; i++){
			if(board.gattis[i].state === "motion"){
				flag = false;
				break;
			}
		}
		if(flag){
			board.state = "first";			
			setTimeout(function(){
				board.nextTurn(document.getElementById("board"));
			}, 500);
						
		} 
	}

	//update loop
	requestAnimationFrame(update)
}


document.onkeydown = function(e){
	if(e.keyCode === 32){	
		startGame();
	}
	console.log(e.keyCode);
}

function startGame(){
	ctx.clearRect(0,0,canvas.width, canvas.height);
	backCtx.clearRect(0,0,canvas.width, canvas.height);

	document.getElementById("top").style.visibility = "visible";
	document.getElementById("bottom").style.visibility = "visible";
	document.getElementById("pocket0").style.visibility = "visible";
	document.getElementById("pocket1").style.visibility = "visible";
	document.getElementById("pocket2").style.visibility = "visible";
	document.getElementById("pocket3").style.visibility = "visible";
	document.getElementById("menu-box").style.visibility = "hidden";

	start();
	gameStarted = true;		
}

document.getElementById("btn-start-game").onclick = function(){
	startGame();
}





