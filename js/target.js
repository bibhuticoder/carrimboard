var ut = new Util();

class Target{
	constructor(){	
		this.flag = false;	
	}

	draw(ctx, striker, cursor){

		ctx.shadowBlur=0;
		ctx.shadowColor="";	

		//power line
		var x1 = striker.pos.x, y1 = striker.pos.y, x2 = cursor.final.x, y2 = cursor.final.y;
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.lineWidth = 4;
		ctx.stroke();
		
		//guide line		
		var m = 4, n = 3;
		var x3 = ((m*x1 - n*x2)/(m-n));
		var y3 = ((m*y1 - n*y2)/(m-n));		
		ctx.beginPath();
		ctx.moveTo(x3, y3);
		ctx.lineTo(x1, y1);
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#373737";
		ctx.lineCap = 'round';
		ctx.setLineDash([1, 5]);/*dashes are 5px and spaces are 3px*/
		ctx.stroke();
	
		//arrow head
		ctx.setLineDash([5, 0]);
		var tox = x3,
			toy = y3,
			fromx = x1,
			fromy = y1;
		var headlen = 10;   // length of head in pixels
	    var angle = Math.atan2(toy-fromy,tox-fromx);	  
	    ctx.beginPath();
	    ctx.moveTo(tox, toy);
	    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
	    ctx.moveTo(tox, toy);
	    ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));	   
	    ctx.stroke();

	    //reset
	    ctx.setLineDash([5, 0]);
		ctx.lineWidth = 1;
		ctx.strokeStyle = "black";

		
		//angle
		var p2 = striker.pos;
		var p1 = cursor.final;
		var angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
		
	}

	determinePower(p1, p2){
		var angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
		
		//power
		var d = ut.getDistance(p1, p2);				
		var fx = d*Math.cos(angle);
		var fy = d*Math.sin(angle);

		return({
			x : fx,
			y : fy,
			d : d
		});
	}
}