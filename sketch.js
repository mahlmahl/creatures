var generation = 1;
var best; //creature.js, line 46
var aver = [];
var food = [];
var popul = new Population();
var creatures_count = 50;
var food_count = 50;
var fit = 20;
var f = [];
var w = 800, h = 700;
var graphics;

function setup() {
	createCanvas(w + 400, h);
	graphics = createGraphics(400, h);

	for(var i = 0; i < food_count; i++){
		food.push(new Food());
	}
	for(var i = 0; i < creatures_count; i++){
		f.push(new Creature());
	}
	popul.setIndividuals(f);
}

function draw() {
	background(91);
	
	for(var i = 0; i < food_count; i++){
		food[i].show();
	}
	for(var i = 0; i < creatures_count; i++){
		popul.individuals[i].update();
		popul.individuals[i].show();
	}

	popul.maxFitness();
	if(frameCount % 1000 == 0){
		selection();
	}
	
	drawBrain(best.brain);
	
	document.getElementById("status").innerHTML = "generation: "+generation+", best fitness: " + popul.bestFitness + ", average fitness: " + popul.averFitness;
}

function selection(){
	
	aver.push(popul.averFitness);
	var c = [];
	
	var children = popul.selection();
	for(var i = 0; i < children.length; i++){
		c.push(new Creature(children[i]));
	}
	popul.setIndividuals(c);
	popul.mutation();
	popul.bestFitness = 0;
	generation++;
}

function drawBrain(brain){
	var x_space = graphics.width / (brain.inputs.length + 1);
	var y_space = graphics.height / (brain.layers.length + 2);
	var neurons = [];
	neurons.push([]);
	
	for(var i = 0; i < brain.inputs.length; i++){
		neurons[0].push([(i+1)*x_space, y_space, brain.inputs[i]]);
	}
	
	for(var j = 0; j < brain.layers.length; j++){
		x_space = graphics.width / (brain.layers[j].neurons.length + 1);
		neurons.push([]);
		for(var i = 0; i < brain.layers[j].neurons.length; i++){
			neurons[j+1].push([(i+1) * x_space, (j + 2) * y_space, brain.layers[j].neurons[i].output, brain.layers[j].neurons[i].weights]);
		}
	}
	
	graphics.background(231);
	graphics.noStroke();
	graphics.fill(0);
	graphics.text('Best brain', 10, 20);
	
	for(var j = 0; j < neurons.length; j++){
		for(var i = 0; i < neurons[j].length; i++){
			graphics.push();
			graphics.translate(neurons[j][i][0], neurons[j][i][1]);
			graphics.fill(255);
			graphics.stroke(0);
			graphics.ellipse(0, 0, 50, 50);
			graphics.noStroke();
			graphics.fill(0);
			graphics.textAlign(CENTER);
			graphics.text(Math.round(neurons[j][i][2] * 100) / 100, 0, 4);
			graphics.pop();
			if(j > 0){
				for(var n = 0; n < neurons[j-1].length; n++){
					graphics.push();
					if(neurons[j][i][3][n] >= 0){
						graphics.stroke(0, 255, 0, 100);
					}else{
						graphics.stroke(255, 0, 0, 100);
					}
					graphics.strokeWeight(Math.abs(neurons[j][i][3][n] * 5));
					graphics.line(neurons[j][i][0], neurons[j][i][1], neurons[j-1][n][0], neurons[j-1][n][1]);
					graphics.pop();
				}
			}
		}
	}
	
	for(var i = 0; i < aver.length; i++){
		graphics.fill(255, 0, 0, 50);
		graphics.noStroke();
		graphics.rect(i * 5 + 1, h - aver[i] * 5, 5, aver[i] * 5);
	}
	
	image(graphics, w, 0);
}