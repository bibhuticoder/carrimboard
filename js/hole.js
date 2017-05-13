var ut = new Util();

class Hole{
	constructor(index){	
		this.radius = 15;
		this.num = index;
		this.pocket = [];

		var unit = 25;
		if(index === 0){
			this.x = unit;
			this.y = unit;
		}else if(index === 1){
			this.x = canvas.width - unit;
			this.y = unit;
		}else if(index === 2){
			this.x = canvas.width - unit;
			this.y = canvas.height - unit;
		}else if(index === 3){
			this.x = unit;
			this.y = canvas.height - unit;
		}
	}

	draw(ctx, canvas){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
		ctx.fillStyle = "gray";
		ctx.shadowBlur=0;
		ctx.shadowColor="";	
		ctx.fill();

		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius-2, 0, 2*Math.PI);
		ctx.fillStyle = "#373737";		
		ctx.fill();

	}

	check(gatti){
		var d = ut.getDistance(new Point(this.x, this.y), new Point(gatti.pos.x, gatti.pos.y));
		return(d < this.radius);
	}

	addToPocket(gatti){
		this.pocket.push(gatti);

	
		var g = document.createElement("div");
		g.setAttribute("class", "gatti gatti-" + gatti.type);
		var p = document.getElementById("pocket" + this.num);

		var x1 = parseInt(p.style.left);
		var y1 = parseInt(p.style.top);
		var x2 = x1 + parseInt(p.style.width);
		var y2 = y1 + parseInt(p.style.height);

		var x = ut.random(x1, x2);
		var y = ut.random(y1, y2);

		p.appendChild(g);
			
	}
}