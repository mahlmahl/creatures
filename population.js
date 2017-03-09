function Population(options){
	
	this.options = options || {};
	this.mutationRate = this.options.mutationRate || 0.1;
	this.crossoverMode = this.options.crossoverMode || '50:50'; // 'mid', 'ave', '50:50', 'low', 'hi';
	this.fitnessValue = this.options.fitnessValue || 'fitness';
	this.genomeValue = this.options.genomeValue || 'genome';
	
	this.individuals = [];
	this.bestFitness = 0;
	this.averFitness = 0;
	this.genesLength = 0;
	
}

Population.prototype.checkIndividual = function(el){
	if(el[this.fitnessValue] == undefined) throw "Error 01: At least one individual has no fitness!";
	if(el[this.genomeValue] == undefined) throw "Error 01: At least one individual has no genome!";
	if( ! this.genesLength) this.genesLength = el[this.genomeValue].length;
	return true;
}

Population.prototype.setIndividuals = function(array_of_individuals){
	this.individuals = [];
	for(var i = 0, il = array_of_individuals.length; i < il; i++){
		if(this.checkIndividual(array_of_individuals[i])){
			this.individuals.push(array_of_individuals[i]);
		}
	}
	this.maxFitness();
}

Population.prototype.maxFitness = function(){
	var max = 0;
	var sum = 0;
	for(var i = 0, il = this.individuals.length; i < il; i++){
		if(this.checkIndividual(this.individuals[i]) && this.individuals[i][this.fitnessValue] > max) max = this.individuals[i][this.fitnessValue];
		sum += this.individuals[i][this.fitnessValue];
	}
	this.bestFitness = max;
	this.averFitness = sum / il;
	return max;	
}

Population.prototype.selectIndividual = function(){
	var iterations = 0;
	while(true){
		iterations++;
		var random_fitness = Math.floor(Math.random() * this.maxFitness());
		var index = Math.floor(Math.random() * this.individuals.length);
		if(this.checkIndividual(this.individuals[index]) && this.individuals[index][this.fitnessValue] > random_fitness && this.individuals[index].alive) return this.individuals[index];
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
	var genome;
	var mid = Math.floor(Math.random() * genome1.length);
	for(var i = 0, il = genome1.length; i < il; i++){
		switch(this.crossoverMode){
			case 'mid':
				genome = i < mid ? genome1[i] : genome2[i];
				break;
			case '50:50':
				genome = Math.random() < 0.5 ? genome1[i] : genome2[i];
				break;
			case 'ave':
				genome = (genome1[i] + genome2[i]) / 2;
				break;
			case 'low':
				genome = Math.min(genome1[i],genome2[i]);
				break;
			case 'hi':
				genome = Math.max(genome1[i],genome2[i]);
				break;
			default: // 50:50
				genome = Math.random() < 0.5 ? genome1[i] : genome2[i];
		}
		if(Math.random() < this.mutationRate){
			genome = Math.random() * 2 - 1;
		}
		newgenome.push(genome);
	}
	return newgenome;
}

Population.prototype.selection = function(){
	var a = [];
	var pair, child;
	for(var i = 0, il = this.individuals.length; i < il; i++){
		pair = this.selectPair();
		child = this.crossover(pair[0][this.genomeValue], pair[1][this.genomeValue]);
		a.push(child);
	}
	return a;
}

Population.prototype.mutation = function(){
	var gran, geno;
	for(var i = 0, il = this.individuals.length; i < il; i++){
		if(Math.random() < this.mutationRate){
			geno = this.individuals[i].brain.getWeights();
			gran = Math.floor(Math.random() * geno.length);
			geno[gran] *= Math.random() - 0.5;
			this.individuals[i].brain.setWeights(geno);
			this.individuals[i][this.genomeValue] = geno;
		}
	}
}

























