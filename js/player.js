class Player{
	constructor(name, order){
		this.name = name;
		this.score = 0;

		if(order === 0) this.id = "top";
		else this.id = "bottom";
	}

	incScore(q){
		if(q === "queen") this.score += 10;
		else this.score++;
		document.getElementById(this.id).innerText = this.name + " : " + this.score;
	}

	decScore(){
		if(this.score >= 1) this.score--;
		document.getElementById(this.id).innerText = this.name + " : " + this.score;
	}

	applyFine(type){
		if(type === "striker"){
			if(this.score >= 2)
				this.score -= 2;
		}else if(type === "invalid-gatti"){
			if(this.score >= 5)
			this.score -= 5;
		}
		document.getElementById(this.id).innerText = this.name + " : " + this.score;
	}
}