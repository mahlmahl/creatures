var generation = 1;
var best;
var aver = [];
var creatures = [];
var food = [];
var popul = new Population();
var creatures_count = 50;
var food_count = 50;
var fit = 20;
var f;
var mult = 3;

function setup() {
	createCanvas(800, 700);
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
	for(var i = 0; i < aver.length; i++){
		fill(255, 0, 0, 50);
		noStroke();
		rect(i * 5 + 1, height - aver[i] * 5, 5, aver[i] * 5);
	}
	popul.maxFitness();
	if(/*popul.maxFitness() >= fit*/frameCount % 1000 == 0){
		selection();
	}
	//if(frameCount % 1000 == 0) popul.mutation();
	document.getElementById("status").innerHTML = "generation: "+generation+", best fitness: " + popul.bestFitness + ", average fitness: " + popul.averFitness;
	document.getElementById("neural").innerHTML = best.brain.show();
	document.getElementById("weights").value = "["+best.brain.getWeights()+"]";
}

function selection(){
	
	aver.push(popul.averFitness);
	var c = [];
	
	var children = popul.selection();
	popul.mutation();
	
	for(var i = 0; i < children.length; i++){
		c.push(new Creature(children[i]));
	}

	popul.setIndividuals(c);
	popul.bestFitness = 0;
	creatures = popul.individuals;
	generation++;
}