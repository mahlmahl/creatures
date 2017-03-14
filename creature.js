function Creature(genes){
	this.pos = createVector(random(w), random(h));
	this.vel = p5.Vector.random2D();
	this.brain = NeuralNetwork.create([4, 3, 2],[null, 'tanh', 'line']);
	if(genes){
		this.brain.setWeights(genes);
		this.genome = genes;
	}else{
		this.genome = this.brain.getWeights();
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
			food[i].pos = createVector(random(w), random(h));
			this.fitness++;
		}
	}
	return food[index];
}

Creature.prototype.update = function(){
	if( ! this.alive) return;
	var pair;
	var closest = this.closestFood();
	pair = this.brain.process([this.pos.x - closest.pos.x, this.pos.y - closest.pos.y, this.vel.mag(), this.vel.heading()]);
	this.vel = createVector(pair[0], pair[1]);
	this.pos.add(this.vel);
	
	if(this.pos.x >= w - 5)this.pos.x = 6;
	if(this.pos.x <= 5) this.pos.x = w - 6;
	if(this.pos.y >= h - 5) this.pos.y = 6;
	if(this.pos.y <= 5) this.pos.y = h - 6;
	
	if(this.pos.x >= w - 5 || this.pos.x <= 5 || this.pos.y >= h - 5 || this.pos.y <= 5){
		this.vel = p5.Vector.random2D();
		this.pos.add(this.vel);
	}
}

Creature.prototype.show = function(){
	if( ! this.alive) return;
	fill(0, this.fitness * (255/popul.bestFitness), 0, 200);
	if(this.fitness >= popul.bestFitness){fill(0, 255, 0); best = this;}
	stroke(0);
	push();
	translate(this.pos.x, this.pos.y);
	rotate(this.vel.heading());
	ellipse(0, 0, 10, 10);
	line(0, 0, 10, 0);
	pop();
	
}