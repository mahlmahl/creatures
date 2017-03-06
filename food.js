function Food(){
	this.pos = createVector(random(width), random(height));
}

Food.prototype.show = function(){
	
	noStroke();
	fill(255, 255, 0, 200);
	ellipse(this.pos.x, this.pos.y, 8, 8);
	
}