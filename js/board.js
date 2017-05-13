class Board{
	constructor(ct, cn){
		this.ctx = ct;
		this.canvas = cn;
		this.gattis = [];
		this.holes = [];
		this.target;
		this.striker;
		this.cursor;
		this.state;
		this.turn;
		this.next;	
		this.player1;
		this.player2;	
		this.queenMode;
	}

	init(){		
		this.cursor = {initial:new Point(0,0), final:new Point(0,0)};
		this.target = new Target();
		this.striker = new Gatti("striker", new Point(250, canvas.height-60));
		this.gattis.push(this.striker);
		
		//make board.holes
		for(var i=0; i<4; i++) this.holes.push(new Hole(i));	


		//create players
		this.player1 = new Player("Player 1", 0);
		this.player2 = new Player("Player 2", 1);

		this.state = "first";	
		this.turn = "bottom";	
		this.next = "top";
		this.queenMode = false;	
	}

	draw(){
		var ctx = this.ctx;
		var canvas = this.canvas;

		//players
		document.getElementById("top").innerText = this.player1.name + " : 0";
		document.getElementById("bottom").innerText = this.player2.name + " : 0";

		//draw holes
		for(var i=0; i<this.holes.length; i++) this.holes[i].draw(backCtx, canvas);	

		//center
		ctx.beginPath();
		ctx.arc(canvas.width/2, canvas.height/2, 50, 0, 2*Math.PI);		
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(canvas.width/2, canvas.height/2, 55, 0, 2*Math.PI);		
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(canvas.width/2, canvas.height/2, 20, 0, 2*Math.PI);	
		ctx.stroke();

		//boundaries
		ctx.strokeRect(55, 55, canvas.width-110, canvas.height-110);
		ctx.strokeRect(70, 70, canvas.width-140, canvas.height-140);

		//boundary circle
		var unit = 65;
		var arrPos = [];		
		arrPos.push({x:unit, y:unit});				
		arrPos.push({x:canvas.width - unit, y:unit});	
		arrPos.push({x:canvas.width - unit, y:canvas.width - unit});
		arrPos.push({x:unit, y:canvas.height - unit});

		for(var i=0; i<arrPos.length; i++){
			var p = arrPos[i];
			
			//boundary2
			ctx.beginPath();
			ctx.arc(p.x, p.y, 15, 0, 2*Math.PI);		
			ctx.fillStyle = "maroon";
			ctx.fill();

			//center
			ctx.beginPath();
			ctx.arc(p.x, p.y, 13, 0, 2*Math.PI);		
			ctx.fillStyle = "#FFFFE0";
			ctx.fill();
			
			//boundary1
			ctx.beginPath();
			ctx.arc(p.x, p.y, 12, 0, 2*Math.PI);		
			ctx.fillStyle = "#373737";
			ctx.fill();
			
			//center
			ctx.beginPath();
			ctx.arc(p.x, p.y, 10, 0, 2*Math.PI);		
			ctx.fillStyle = "#FFFFE0";
			ctx.fill();
		}
	

		//four danger circles
		var x, y;
		var unit = 67;
		for(var i=0; i<arrPos.length; i++){
			if(i===0){
				x = unit;
				y = unit;
			}else if(i === 1){
				x = -unit;
				y = unit;
			}else if(i === 2){
				x = -unit;
				y = -unit;
			}else if(i === 3){
				x = unit;
				y = -unit;
			}

			var p = arrPos[i];
			ctx.beginPath();
			ctx.arc(p.x+x, p.y+y, 20, 0, 2*Math.PI);	
			ctx.fillStyle="lightsalmon"; //lighter than
			ctx.fill();

			ctx.beginPath();
			ctx.arc(p.x+x, p.y+y, 20, 0, 2*Math.PI);				
			ctx.stroke();
		}

		//four corner lines
		var unitX, unitY;
		var unit = 70;
		for(var i=0; i<arrPos.length; i++){

			if(i===0){
				unitX = unit;
				unitY = unit;
			}else if(i === 1){
				unitX = -unit;
				unitY = unit;
			}else if(i === 2){
				unitX = -unit;
				unitY = -unit;
			}else if(i === 3){
				unitX = unit;
				unitY = -unit;
			}


			var p = arrPos[i];
			var tox = p.x + unitX,
				toy = p.y + unitY,
				fromx = p.x,
				fromy = p.y;
			var headlen = 8;
		    var angle = Math.atan2(toy-fromy,tox-fromx);	  
		    ctx.beginPath();
		    ctx.moveTo(fromx, fromy);
		    ctx.lineTo(tox, toy);
		    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
		    ctx.moveTo(tox, toy);
		    ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));	   
		    ctx.stroke();
		}

	}

	arrangeGattis(ctx){
		this.gattis.push(new Gatti("queen", new Point(canvas.width/2,canvas.height/2)));

		this.gattis[0].velocity.x = 0.00005;
		this.gattis[0].state = "motion";

		var s = this.gattis[0].radius*2;

		this.gattis.push(new Gatti("black", new Point(canvas.width/2 + s,canvas.height/2)));
		this.gattis.push(new Gatti("white", new Point(canvas.width/2 + 2*s,canvas.height/2)));

		this.gattis.push(new Gatti("black", new Point(canvas.width/2 - s,canvas.height/2)));
		this.gattis.push(new Gatti("white", new Point(canvas.width/2 - 2*s,canvas.height/2)));

		this.gattis.push(new Gatti("black", new Point(canvas.width/2,canvas.height/2 - s)));
		this.gattis.push(new Gatti("white", new Point(canvas.width/2,canvas.height/2 - 2*s)));

		this.gattis.push(new Gatti("black", new Point(canvas.width/2,canvas.height/2 + s)));
		this.gattis.push(new Gatti("white", new Point(canvas.width/2,canvas.height/2 + 2*s)));

		this.gattis.push(new Gatti("black", new Point(canvas.width/2 + s,canvas.height/2 + s)));
		this.gattis.push(new Gatti("white", new Point(canvas.width/2 + 2*s,canvas.height/2 + 2*s)));

		this.gattis.push(new Gatti("black", new Point(canvas.width/2 - s,canvas.height/2 - s)));
		this.gattis.push(new Gatti("white", new Point(canvas.width/2 - 2*s,canvas.height/2 - 2*s)));

		this.gattis.push(new Gatti("black", new Point(canvas.width/2 + s,canvas.height/2 - s)));
		this.gattis.push(new Gatti("white", new Point(canvas.width/2 + 2*s,canvas.height/2 - 2*s)));

		this.gattis.push(new Gatti("black", new Point(canvas.width/2 - s,canvas.height/2 + s)));
		this.gattis.push(new Gatti("white", new Point(canvas.width/2 - 2*s,canvas.height/2 + 2*s)));

	}

	nextTurn(container){

		if(this.turn !== this.next){
			//rotate container
			container.style.WebkitTransitionDuration='1.5s';

			if(this.turn === "top"){
				this.turn = "bottom";
				this.next = "top";
				container.style.webkitTransform = 'rotate(0deg)';
				document.getElementById("top").style.webkitTransform = 'rotate(0deg)';
				document.getElementById("bottom").style.webkitTransform = 'rotate(0deg)';
			}else{
				this.turn = "top";
				this.next = "bottom";
				container.style.webkitTransform = 'rotate(180deg)';
				document.getElementById("top").style.webkitTransform = 'rotate(180deg)';
				document.getElementById("bottom").style.webkitTransform = 'rotate(180deg)';
			}
		}else{
			if(this.turn === "top") this.next = "bottom";
			else this.next = "top";
		}

		//if board is in queen mode

		 

	}

	getCurrentPlayer(){
		if(this.turn === "top") return this.player1;
		if(this.turn === "bottom") return this.player2;
	}

	toast(msg, callback){
		var toast = document.getElementById("toast");
		toast.visibility = "visible";

		setTimeout(function(){
			toast.visibility = "hidden";
			callback();
		}, 500);
	}
		

}