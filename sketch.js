var generation = 1;
var best;
var creatures = [];
var food = [];
var popul = new Population();
var creatures_count = 50;
var food_count = 20;
var fit = 20;
var f;
var mult = 3;

function setup() {
	createCanvas(800, 600);
	for(var i = 0; i < food_count; i++){
		food.push(new Food());
	}
	for(var i = 0; i < creatures_count; i++){
		creatures.push(new Creature());
	}
	popul.setIndividuals(creatures);
}

function draw() {
	background(91);
	for(var i = 0; i < food_count; i++){
		food[i].show();
	}
	for(var i = 0; i < creatures_count; i++){
		creatures[i].update();
		creatures[i].show();
	}
	
	if(popul.maxFitness() >= fit){
		selection();
	}
	
	document.getElementById("status").innerHTML = "generation: "+generation+", best fitness: " + popul.bestFitness + "/" + fit;
	document.getElementById("neural").innerHTML = best.brain.show();
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
	generation++;
}