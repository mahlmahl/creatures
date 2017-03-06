function Population(){
	
	this.individuals = [];
	this.bestFitness = 0;
	this.genesLength = 0;
	this.mutationRate = 0.01;
	this.crossoverMode = '50'; // 'mid';
	
}

Population.prototype.checkIndividual = function(el){
	if(el.fitness == undefined) throw "Error 01: At least one individual has no fitness!";
	if(el.genome == undefined || el.genome.genes == undefined) throw "Error 01: At least one individual has no genome!";
	if( ! this.genesLength) this.genesLength = el.genome.genes.length;
	return true;
}

Population.prototype.setIndividuals = function(array_of_individuals){
	this.individuals = [];
	var max = 0;
	for(var i = 0, il = array_of_individuals.length; i < il; i++){
		if(this.checkIndividual(array_of_individuals[i])){
			this.individuals.push(array_of_individuals[i]);
			if(this.individuals[i].fitness > max) max = this.individuals[i].fitness;
		}
	}
	this.bestFitness = max;
}

Population.prototype.maxFitness = function(){
	var max = 0;
	for(var i = 0, il = this.individuals.length; i < il; i++){
		if(this.checkIndividual(this.individuals[i]) && this.individuals[i].fitness > max) max = this.individuals[i].fitness;
	}
	this.bestFitness = max;
	return max;	
}

Population.prototype.selectIndividual = function(){
	var iterations = 0;
	while(true){
		iterations++;
		var fitness = Math.floor(Math.random() * this.maxFitness());
		var index = Math.floor(Math.random() * this.individuals.length);
		if(this.checkIndividual(this.individuals[index]) && this.individuals[index].fitness > fitness && this.individuals[index].alive) return this.individuals[index];
		if(iterations > 1000) return null;
	}
}

Population.prototype.selectPair = function(){
	var iterations = 0;
	while(true){
		iterations++;
		var obj1 = this.selectIndividual();
		var obj2 = this.selectIndividual();
		if(obj1 != obj2) return [obj1, obj2];
		if(iterations > 1000) return [null, null];
	}
}

Population.prototype.crossover = function(genome1, genome2){
	if(genome1.length != genome2.length) return false;
	var newgenome = [];
	var mid = Math.floor(Math.random() * genome1.length);
	for(var i = 0, il = genome1.length; i < il; i++){
		if(this.crossoverMode == 'mid'){
			newgenome.push(i < mid ? genome1[i] : genome2[i]);
		}else{
			newgenome.push(Math.random() < 0.5 ? genome1[i] : genome2[i]);
		}
	}
	return newgenome;
}

Population.prototype.selection = function(){
	var a = [];
	var pair, child;
	for(var i = 0, il = this.individuals.length; i < il; i++){
		pair = this.selectPair();
		child = this.crossover(pair[0].genome.genes, pair[1].genome.genes);
		a.push(child);
	}
	return a;
}

Population.prototype.mutation = function(){
	var glen;
	for(var i = 0, il = this.individuals.length; i < il; i++){
		if(Math.random() < this.mutationRate){
			this.individuals[i].brain = new NeuralNetwork([2, 3, 2]);
		}
	}
}

























