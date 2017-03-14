// Neuron class

var Neuron = {
	
	result: null,
	output: null,
	bias: null,
	weights: [],
	
	create: function(number_of_inputs){
		var obj = Object.create(this);
		obj.weights = [];
		for(var i = 0; i < number_of_inputs; i++){
			obj.weights.push(obj.random());
		}
		obj.bias = obj.random();
		return obj;
	},
	
	random: function(){
		return Math.random() * 2 - 1;
	},
	
	activate: function(x, activation_function){
		switch (activation_function){
			case 'tanh':
				return Math.tanh(x);
				break;
			case 'sigm': // sigmoid
				return 1.0 / (1.0 + Math.exp(-x));
				break;
			case 'unit': //unit step
				if(x < 0) return 0;
				if(x == 0) return 0.5;
				if(x > 0) return 1;
				break;
			case 'sign': // signum
				if(x < 0) return -1;
				if(x == 0) return 0.5;
				if(x > 0) return 1;
				break;
			case 'wise': // piece-wise
				if(x <= -0.5) return 0;
				if(x > -0.5 && x < 0.5) return x + 0.5;
				if(x >= 0.5) return 1;
				break;
			case 'line': // linear
				return x;
				break;
			default: // Hyperbolic tangent
				return Math.tanh(x);
		}
	},
	
	process: function(array_of_inputs, activation_function){
		if(array_of_inputs.length != this.weights.length) return false;
		this.result = null;
		for(var i = 0, al = array_of_inputs.length; i < al; i++){
			this.result += array_of_inputs[i] * this.weights[i];
		}
		this.result += this.bias;
		this.output = this.activate(this.result, activation_function);
	}
	
}

// Layer class

var Layer = {
	neurons: [],
	outputs: [],
	activation_function: null,
	
	create: function(number_of_neurons, inputs_per_neuron, activation_function){
		var obj = Object.create(this);
		obj.neurons = [];
		obj.outputs = [];
		obj.activation_function = activation_function || 'none';
		for(var n = 0; n < number_of_neurons; n++){
			obj.neurons.push(Neuron.create(inputs_per_neuron));
		}
		return obj;
	},
	
	process: function(array_of_inputs){
		this.outputs = [];
		for(var n = 0, nl = this.neurons.length; n < nl; n++){
			this.neurons[n].process(array_of_inputs, this.activation_function);
			this.outputs.push(this.neurons[n].output);
		}
	}
}

// Neural Network class

var NeuralNetwork = {
	layers: [],
	inputs: [],
	weights_count: 0,
	activation_functions: null,
	
	create: function(topology, activation_functions_by_layers){
		var obj = Object.create(this);
		obj.layers = [];
		obj.inputs = [];
		obj.weights_count = 0;
		obj.activation_functions = activation_functions_by_layers || [];
		for(var t = 1, tl= topology.length; t < tl; t++){
			obj.layers.push(Layer.create(topology[t], topology[t-1], obj.activation_functions[t]));
			obj.weights_count += topology[t] * (topology[t-1] + 1);
		}
		return obj;
	},
	
	process: function(array_of_inputs){
		this.inputs = array_of_inputs || [];
		var inputs = this.inputs;
		for(var l = 0, ll = this.layers.length; l < ll; l++){
			this.layers[l].process(inputs);
			inputs = this.layers[l].outputs;
		}
		return inputs;
	},
	
	getWeights: function(){
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
	},
	
	setWeights: function(weights){
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
}