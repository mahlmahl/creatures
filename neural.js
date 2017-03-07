// Neuron class

function Neuron(number_of_inputs){
	
	this.result = null;
	this.output = null;
	this.bias = this.random();
	this.weights = [];
	
	for(var i = 0; i < number_of_inputs; i++){
		this.weights.push(this.random());
	}
	
}

Neuron.prototype.random = function(){
	return Math.random() * 2 - 1;
}

Neuron.prototype.activate = function(x, activation_function){
	switch (activation_function){
		case 'tanh':
			return Math.tanh(x);
			break;
		case 'sigmoid':
			return 1.0 / (1.0 + Math.exp(-x));
			break;
		default:
			return x;
	}
}

Neuron.prototype.process = function(array_of_inputs, activation_function){
	if(array_of_inputs.length != this.weights.length) return false;
	this.result = null;
	for(var i = 0, al = array_of_inputs.length; i < al; i++){
		this.result += array_of_inputs[i] * this.weights[i];
	}
	this.result += this.bias;
	this.output = this.activate(this.result, activation_function);
}

// Layer class

function Layer(number_of_neurons, inputs_per_neuron, activation_function){
	
	this.neurons = [];
	this.outputs = [];
	this.activation_function = activation_function || 'none';
	
	for(var n = 0; n < number_of_neurons; n++){
		this.neurons.push(new Neuron(inputs_per_neuron));
	}
	
}

Layer.prototype.process = function(array_of_inputs){
	this.outputs = [];
	for(var n = 0, nl = this.neurons.length; n < nl; n++){
		this.neurons[n].process(array_of_inputs, this.activation_function);
		this.outputs.push(this.neurons[n].output);
	}
}

// Neural Network class

function NeuralNetwork(topology, activation_functions_by_layers){
	
	this.layers = [];
	this.inputs = [];
	this.weights_count = 0;
	this.activation_functions = activation_functions_by_layers || [];
	
	for(var t = 1, tl= topology.length; t < tl; t++){
		this.layers.push(new Layer(topology[t], topology[t-1], this.activation_functions[t-1]));
		this.weights_count += topology[t] * (topology[t-1] + 1);
	}
	
}

NeuralNetwork.prototype.process = function(array_of_inputs){
	this.inputs = array_of_inputs || [];
	var inputs = this.inputs;
	for(var l = 0, ll = this.layers.length; l < ll; l++){
		this.layers[l].process(inputs);
		inputs = this.layers[l].outputs;
	}
	return inputs;
}

NeuralNetwork.prototype.getWeights = function(){
	var weights = [];
	for(var l = 0, ll = this.layers.length; l < ll; l++){
		for(var n = 0, nl = this.layers[l].neurons.length; n < nl; n++){
			for(var w = 0, wl = this.layers[l].neurons[n].weights.length; w < wl; w++){
				weights.push(this.layers[l].neurons[n].weights[w]);
			}
			weights.push(this.layers[l].neurons[n].bias);
		}	
	}
	return weights;
}

NeuralNetwork.prototype.setWeights = function(weights){
	if(weights.length != this.weights_count) return false;
	var index = 0;
	for(var l = 0, ll = this.layers.length; l < ll; l++){
		for(var n = 0, nl = this.layers[l].neurons.length; n < nl; n++){
			for(var w = 0, wl = this.layers[l].neurons[n].weights.length; w < wl; w++){
				this.layers[l].neurons[n].weights[w] = weights[index];
				index++;
			}
			this.layers[l].neurons[n].bias = weights[index];
			index++;
		}	
	}
}