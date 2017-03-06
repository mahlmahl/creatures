function Food(){
	this.pos = createVector(random(width), random(height));
	this.poison = Math.random() < 0.01;
}

Food.prototype.show = function(){
	
	noStroke();
	if(this.poison){
		fill(255, 0, 0, 100);
	}else{
		fill(0, 255, 0, 100);
	}
	ellipse(this.pos.x, this.pos.y, 8, 8);
	
}