
var typeColor= {
	"black" : "#3366ff",
	"white" : "purple",
	"queen" : "red",
	"striker" : "green"
};

var typeSize = {
	"black" : 10,
	"white" : 10,
	"queen" : 10,
	"striker" : 13
}

var ut = new Util();

class Gatti{
	constructor(type, pos){
		this.type = type;
		this.color = typeColor[type];
		this.radius = typeSize[type];
		this.boundary = this.radius + 3;
		this.pos = pos;
		this.velocity = new Point(0,0);
		this.friction = 0.92;	
		this.state = "rest";
		this.status = "ok";	
	}

	draw(ctx){
		
		//calculate pos5  bv
		this.pos.x += this.velocity.x;
		this.pos.y += this.velocity.y;
		this.velocity.x *= this.friction;
		this.velocity.y *= this.friction;

		//check state
		if((Math.floor(this.velocity.x.toFixed(1) === 0) || Math.floor(this.velocity.y.toFixed(1)) === 0) && board.state === "third"){
			this.state = "rest";						
		}else{
			this.state = "motion";
		}			
		//draw gatti
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2*Math.PI);		
		ctx.shadowBlur=3;
		ctx.shadowColor="black";		
		ctx.fillStyle=this.color;
		ctx.fill();		
	
	}

	strike(fx, fy){
		this.velocity.x = fx;
		this.velocity.y = fy;
	}

	checkPoint(p){
		var pDist = ut.getDistance(p, this.pos);
		return (pDist < this.radius);
	}

	checkBoundary(canvas){
		
			//top
			if(this.pos.y - this.radius < 0){
				this.velocity.y *= -1;
				while(this.pos.y - this.radius < 0) this.pos.y++;			
			}
			//bottom
			else if(this.pos.y + this.radius > canvas.height){			
				this.velocity.y *= -1;
				while(this.pos.y + this.radius > canvas.height) this.pos.y--;
			}		
			//right
			else if(this.pos.x + this.radius > canvas.width){
				this.velocity.x *= -1; 
				while(this.pos.x + this.radius > canvas.width) this.pos.x--;
			}
			//left
			else if(this.pos.x - this.radius < 0){			
				this.velocity.x *= -1; 	
				while(this.pos.x - this.radius < 0) this.pos.x++;		
			} 			
					
	}
	
	checkCollission(gattis, canvas){
	
			var g1 = this;
			var g2;
			for(var i = 0; i<gattis.length; i++){
				g2 = gattis[i];
				if(g1 !== g2){
					if(ut.checkCirCollission(g1, g2)){					
						
						var dx = g1.pos.x - g2.pos.x;
						var dy = g1.pos.y - g2.pos.y;

						var phi = Math.atan2(dy, dx);

						var mag1 = Math.sqrt(g1.velocity.x * g1.velocity.x + g1.velocity.y * g1.velocity.y);
						var mag2 = Math.sqrt(g2.velocity.x * g2.velocity.x + g2.velocity.y * g2.velocity.y);

						var dir1 = Math.atan2(g1.velocity.y, g1.velocity.x);
						var dir2 = Math.atan2(g2.velocity.y, g2.velocity.x);

						var xspeed1 = mag1 * Math.cos(dir1 - phi);
						var yspeed1 = mag1 * Math.sin(dir1 - phi);

						var xspeed2 = mag2 * Math.cos(dir2 - phi);
						var yspeed2 = mag2 * Math.sin(dir2 - phi);

						var finalXspeed1=xspeed2;
						var finalXspeed2=xspeed1;

						var finalYspeed1 = yspeed1;
						var finalYspeed2 = yspeed2;

						var tempvxi = Math.cos(phi) * finalXspeed1 + Math.cos(phi + Math.PI / 2) * finalYspeed1;
						var tempvyi = Math.sin(phi) * finalXspeed1 + Math.sin(phi + Math.PI / 2) * finalYspeed1;
						var tempvxj = Math.cos(phi) * finalXspeed2 + Math.cos(phi + Math.PI / 2) * finalYspeed2;
						var tempvyj = Math.sin(phi) * finalXspeed2 + Math.sin(phi + Math.PI / 2) * finalYspeed2;

						g1.velocity.x = tempvxi;
						g1.velocity.y = tempvyi;
						g2.velocity.x = tempvxj;
						g2.velocity.y = tempvyj;

						while(ut.checkCirCollission(g1, g2)){
							g1.pos.x += g1.velocity.x;
							g1.pos.y += g1.velocity.y;
							g2.pos.x += g2.velocity.x;
							g2.pos.y += g2.velocity.y;											
						}

					}
				}			
			}	
					
	}

	checkInHoles(holes, gattis){
		for(var i=0; i<holes.length; i++){
			var h = holes[i];
			if(h.check(this)){
				var g, next = false;
				if(this.type === "striker"){
					console.log("asd");
					board.toast("Foul", function(){
						board.getCurrentPlayer().applyFine("striker");	
						next = false; 
					})									
				}else if(this.type === "queen"){
					//turn on queen mode
					board.queenMode = true;
					g = gattis.splice(gattis.indexOf(this), 1)[0];
					h.addToPocket(g);
					next = true;
				}

				if(this.type === "black" || this.type === "white"){
					if(board.queenMode){
						board.getCurrentPlayer().incScore("queen");
					}
					g = gattis.splice(gattis.indexOf(this), 1)[0];
					h.addToPocket(g);
					board.getCurrentPlayer().incScore();
					next = true;
				}

				//next turn
				if(next){
					board.next = board.turn;					
				}else{
					if(board.turn === "top") board.next = "bottom";
					else if(board.turn === "bottom") board.turn = "top";
				}	
			}
		}
	}

}




