function Creature(genes){
	this.mult = 5;
	this.pos = createVector(random(width), random(height));
	this.vel = p5.Vector.random2D().mult(this.mult);
	this.brain = new NeuralNetwork([3, 3, 2]);
	this.genome = {'genes':[]};
	if(genes){
		this.brain.setWeights(genes);
		this.genome.genes = genes;
	}else{
		this.genome.genes = this.brain.getWeights();
	}
	this.fitness = 0;
}

Creature.prototype.closestFood = function(){
	var min = 1000;
	var dist, index;
	for(var i = 0; i < fs; i++){
		dist = food[i].pos.dist(this.pos);
		if(dist < min) {
			min = dist;
			index = i;
		}
		if(dist < 10){
			food[i].pos = createVector(random(width), random(height));
			if(food[i].poison) this.fitness = 0; else this.fitness++;
		}
	}
	return food[index];
}

Creature.prototype.update = function(){
	var pair;
	var closest = this.closestFood();
	//if(frameCount % 20 == 0){
		pair = this.brain.process([this.pos.x - closest.pos.x, this.pos.y - closest.pos.y, closest.poison]);
		this.vel = createVector(pair[0] * 2 - 1, pair[1] * 2 - 1).mult(this.mult);
	//}
	this.pos.add(this.vel);
	
	if(this.pos.x > width) this.pos.x = 0;
	if(this.pos.x < 0) this.pos.x = width;
	if(this.pos.y > height) this.pos.y = 0;
	if(this.pos.y < 0) this.pos.y = height;
	
}

Creature.prototype.show = function(){
	
	fill(this.fitness * 20, 100);
	if(this.fitness >= popul.maxFitness()) fill(0, 255, 255, 100);
	stroke(0);
	push();
	translate(this.pos.x, this.pos.y);
	rotate(this.vel.heading());
	ellipse(0, 0, 10, 10);
	line(0, 0, 10, 0);
	pop();
	
}