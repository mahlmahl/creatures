function Creature(genes){
	this.pos = createVector(random(width), random(height));
	this.vel = p5.Vector.random2D();
	this.brain = new NeuralNetwork([2, 2, 2]);
	this.genome = {'genes':[]};
	if(genes){
		this.brain.setWeights(genes);
		this.genome.genes = genes;
	}else{
		this.genome.genes = this.brain.getWeights();
	}
	this.fitness = 0;
	this.alive = true;
}

Creature.prototype.closestFood = function(){
	var min = 1000;
	var dist, index;
	for(var i = 0, fl = food.length; i < fl; i++){
		dist = food[i].pos.dist(this.pos);
		if(dist < min) {
			min = dist;
			index = i;
		}
		if(dist < 10){
			food[i].pos = createVector(random(width), random(height));
			this.fitness++;
		}
	}
	return food[index];
}

Creature.prototype.update = function(){
	if( ! this.alive) return;
	var pair;
	var closest = this.closestFood();
	pair = this.brain.process([this.pos.x - closest.pos.x, this.pos.y - closest.pos.y]);
	this.vel = createVector(pair[0] * 2 - 1, pair[1] * 2 - 1).mult(mult);
	this.pos.add(this.vel);

	if(this.pos.x > width + 10) this.pos.x = 0;
	if(this.pos.x < -10) this.pos.x = width;
	if(this.pos.y > height + 10) this.pos.y = 0;
	if(this.pos.y < -10) this.pos.y = height;
}

Creature.prototype.show = function(){
	if( ! this.alive) return;
	fill(0, this.fitness * (255/fit), 0, 200);
	if(this.fitness >= popul.bestFitness){fill(0, 255, 0); best = this;}
	stroke(0);
	push();
	translate(this.pos.x, this.pos.y);
	rotate(this.vel.heading());
	ellipse(0, 0, 10, 10);
	line(0, 0, 10, 0);
	pop();
	
}