module.exports = function (p) {

	// Declaring DOM elements
	let _totalGenerations;
	let _averageFitness;
	let _totalPopulation;
	let _mutationRate;
	let _bestPhrase;
	let _allPhrases;

	let domInit = () => {
		// Not using p5.dom to reduce bundle size 😬

		_totalGenerations = document.createElement('span');
		_averageFitness = document.createElement('span');
		_totalPopulation = document.createElement('span');
		_mutationRate = document.createElement('span');
		_bestPhrase = document.createElement('h1');
		
		let _info = document.createElement('div');
		_info.className = 'info';

		_info.insertAdjacentHTML('beforeend', '<strong>Best Phrase:</strong>');
		_info.append(_bestPhrase);

		_info.insertAdjacentHTML('beforeend', 'Total Generations: ');
		_info.append(_totalGenerations);

		_info.insertAdjacentHTML('beforeend', '<br/>Average Fitness: ');
		_info.append(_averageFitness);

		_info.insertAdjacentHTML('beforeend', '<br/>Total Population: ');
		_info.append(_totalPopulation);

		_info.insertAdjacentHTML('beforeend', '<br/>Mutation Rate: ');
		_info.append(_mutationRate);

		_allPhrases = document.createElement('p');
		_allPhrases.className = 'phrases';

		p._userNode.append(_info);
		p._userNode.append(_allPhrases);
	}

	// Evolution begins.. 😝
	// DNA: building block of an organism
	class DNA {
		// creates a DNA of given length
		constructor(len) {
			this.genes = [];
			this.fitness = 0;
			for(let i = 0; i < len; i++)
				this.genes[i] = this.randChar();
		}

		// breading this with another dna and return the child
		crossover(dna) {
			let child = new DNA(this.genes.length);
			let midpoint = p.random(child.genes.length);
			for(let i = 0; i < child.genes.length; i++) {
				if(i < midpoint)
					child.genes[i] = dna.genes[i];
				else
					child.genes[i] = this.genes[i];
			}
			return child;
		}

		// based on given rate, pick a random character
		mutate(rate) {
			for(let i = 0; i < this.genes.length; i++)
				if(p.random() < rate)
					this.genes[i] = this.randChar();
		}

		calcFitness(target) {
			let fitness = 0;
			for(let i = 0; i < this.genes.length; i++)
				if(this.genes[i] === target[i])
					fitness++;
			this.fitness = fitness / target.length;
		}

		// returns genes as a string
		toString() {
			return this.genes.join('');
		}

		randChar() {
			// Allowed charset. (a-z, A-Z and space)
			let chars = 'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			return chars.charAt(p.random(chars.length));
		}
	}

	// Population of virtual organisms
	class Population {
		constructor(target, mutationRate, populationCount) {
			this.target = target;
			this.mutationRate = mutationRate;
			this.organisms = [];
			this.generation = 0;
			this.averageFitness = 0;
			this.best = '';
			this.matingPool = [];
			this.finish = false;

			// Initial population
			for(let i = 0; i < populationCount; i++)
				this.organisms.push(new DNA(target.length));
		}

		calcFitness() {
			let bestIndex = 0;
			for(let i = 0; i < this.organisms.length; i++) {
				let organism = this.organisms[i];
				organism.calcFitness(this.target);

				if(organism.fitness == 1)
					this.finish = true;

				if(organism.fitness > this.organisms[bestIndex].fitness)
					bestIndex = i;
				
				this.averageFitness += organism.fitness;
			}
			this.averageFitness /= this.organisms.length;
			this.best = this.organisms[bestIndex];
		}

		naturalSelection() {
			// Creating a mating pool where frequency of organisms directly proportional to
			// their fitness. Hence more probability of selecting the fittest.
			this.matingPool = [];
			for(let i = 0; i < this.organisms.length; i++) {
				let n = p.floor(this.organisms[i].fitness * 100);
				for(let j = 0; j < n; j++)
					this.matingPool.push(this.organisms[i]);
			}

			// Selecting 2 random organisms from mating pool
			// crossover them and mutate the child based on mutationRate.
			// Put the newly created child into population.
			for(let i = 0; i < this.organisms.length; i++) {
				let a = p.floor(p.random(this.matingPool.length));
				let b = p.floor(p.random(this.matingPool.length));

				let partnerA = this.matingPool[a];
				let partnerB = this.matingPool[b];

				let child = partnerA.crossover(partnerB);
				child.mutate(this.mutationRate);

				this.organisms[i] = child;
			}

			this.generation++;
		}

		finished() {
			return this.finish;
		}

		getBest() {
			return this.best;
		}

		getGeneration() {
			return this.generation;
		}

		getMutationRate() {
			return this.mutationRate;
		}

		getPopulationCount() {
			return this.organisms.length;
		}

		getAverageFitness() {
			return this.averageFitness;
		}

		getOrganisms() {
			let str = '';
			for(let i = 0; i < p.min(this.organisms.length, 10); i++)
				str += this.organisms[i] + '<br/>';
			return str;
		}
	}

	let mPop;

	p.setup = () => {
		p.noCanvas();

		domInit();

		let target = 'Hello World';
		let mutationRate = 0.01;
		let totalPopulation = 100;
		mPop = new Population(target, mutationRate, totalPopulation);
	}

	p.draw = () => {
		mPop.calcFitness();
		mPop.naturalSelection();

		if(mPop.finished())
			p.noLoop();

		_totalGenerations.innerHTML = mPop.getGeneration();
		_averageFitness.innerHTML = mPop.getAverageFitness();
		_totalPopulation.innerHTML = mPop.getPopulationCount();
		_mutationRate.innerHTML = mPop.getMutationRate();
		_bestPhrase.innerHTML = mPop.getBest();
		_allPhrases.innerHTML = mPop.getOrganisms();
	}
}
