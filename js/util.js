class Util{
	constructor(){

	}

	getMousePos(canvas, evt, board) {
	    var rect = canvas.getBoundingClientRect();
	    var marginTop = canvas.style.marginTop;
	    var border = canvas.style.borderWidth;

	    var x = evt.clientX - rect.left;
	    var y = evt.clientY - rect.top - marginTop
	    

	  	if(board.turn === "top"){
	  		x = canvas.width - x;
	  		y = canvas.height - y;
	  	} 

	    return new Point(x, y);	    
	}

	random(min, max){        
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	getDistance(i, f){
		return Math.abs(Math.sqrt(Math.pow((f.x-i.x), 2) + Math.pow((f.y-i.y), 2)));
	}

	checkCirCollission(c1, c2){
		var d = this.getDistance(c1.pos, c2.pos);
		var rad = c1.radius + c2.radius;
		return(d < rad);
	}

	rotate(p, deg){

		if(deg === 90){
			var n = new Point(p.y, -p.x);
			return n;
		}
		
	}

}