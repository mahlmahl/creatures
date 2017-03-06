var creatures = [];
var food = [];
var popul = new Population();
var all = 200;
var fs = 200;
var f;

function setup() {
	createCanvas(600, 600);
	for(var i = 0; i < fs; i++){
		food.push(new Food());
	}
	for(var i = 0; i < all; i++){
		creatures.push(new Creature());
	}
	popul.setIndividuals(creatures);
}

function draw() {
	background(150);
	for(var i = 0; i < fs; i++){
		food[i].show();
	}
	for(var i = 0; i < all; i++){
		creatures[i].update();
		creatures[i].show();
	}
	
	if(popul.maxFitness() > 100){
		selection();
	}
	
}

function selection(){
	
	var c = [];
	
	var children = popul.selection();
	
	for(var i = 0; i < children.length; i++){
		c.push(new Creature(children[i]));
	}

	popul.setIndividuals(c);
	popul.mutation();
	popul.bestFitness = 0;
	creatures = popul.individuals;
}