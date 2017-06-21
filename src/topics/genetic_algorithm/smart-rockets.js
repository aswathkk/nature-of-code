module.exports = function (p) {

	class DNA {
		constructor() {
			this.genes = [];
			this.maxForce = 0.2;
			for(let i = 0; i < lifetime; i++) {
				let force = p5.Vector.random2D();
				force.mult(p.random(this.maxForce));
				this.genes.push(force);
			}
		}

		crossover(partner) {
			let child = new DNA();
			let mp = p.floor(p.random(this.genes.length));
			for(let i = 0; i < child.genes.length; i++)
				if(i < mp)
					child.genes[i] = this.genes[i];
				else
					child.genes[i] = partner.genes[i];
			return child;
		}

		mutate(rate) {
			for(let i = 0; i < this.genes.length; i++) {
				if(p.random() < rate)
					this.genes[i] = p5.Vector.random2D().mult(this.maxForce);
			}
		}
	}

	class Mover {
		constructor(loc, dna) {
			this.loc = loc;
			this.vel = p.createVector(0, 0);
			this.acc = p.createVector(0, 0);
			this.dna = dna;
			this.geneCounter = 0;
			this.isMoving = true;
			this.fitness = 0;
		}

		calcFitness(target) {
			this.fitness = 1 / p5.Vector.sub(target.loc, this.loc).mag();
		}

		run() {
			this.applyForce(this.dna.genes[this.geneCounter]);
			this.geneCounter = (this.geneCounter + 1) % this.dna.genes.length;
			this.update();
			this.draw();
		}

		applyForce(force) {
			this.acc.add(force);
		}

		update() {
			if(this.isMoving) {
				this.vel.add(this.acc);
				this.loc.add(this.vel);
				this.acc.mult(0);
			}
		}

		stop() {
			this.isMoving = false;
		}

		isDead() {
			return this.loc.x < 0 || this.loc.x > p.width || this.loc.y < 0 || this.loc.y > p.height;
		}

		draw() {
			p.fill(0, 100);

			p.push();
			p.translate(this.loc.x, this.loc.y);
			p.rotate(this.vel.heading());
			p.triangle(10, 0, -5, 5, -5, -5);
			p.pop();
		}
	}

	class Obstacle {
		constructor(x, y, w, h) {
			this.loc = p.createVector(x, y);
			this.w = w;
			this.h = h;
		}

		isColliding(loc) {
			return loc.x < this.loc.x + this.w / 2 && loc.x > this.loc.x - this.w / 2 && loc.y < this.loc.y + this.h / 2 && loc.y > this.loc.y - this.h / 2;
		}

		draw() {
			p.fill(200);
			p.rect(this.loc.x, this.loc.y, this.w, this.h);
		}
	}

	class Target extends Obstacle {
		draw() {
			p.fill(233, 30, 99);
			p.rect(this.loc.x, this.loc.y, this.w + 20, this.h + 20);
		}
	}

	class Population {
		constructor(loc, mutationRate, populationCount, target) {
			this.movers = [];
			this.loc = loc;
			this.mutationrate = mutationRate;
			this.generation = 0;
			this.target = target;
			this.averageFitness = 0;
			this.obstacles = [];
			this.matingPool = [];

			for(let i = 0; i < populationCount; i++)
				this.movers.push(new Mover(this.loc.copy(), new DNA()));
		}

		calcFitness() {
			for(let i = 0; i < this.movers.length; i++) {
				this.movers[i].calcFitness(this.target);
				this.averageFitness += this.movers[i].fitness;
				if(this.movers[i].isDead())
					this.movers[i].fitness *= 0.1;
			}
			this.averageFitness /= this.movers.length;
		}

		reproduction() {
			let total = this.movers.reduce((p, c) => p + c.fitness, 0);
			let normalizedFitness = this.movers.map(mov => mov.fitness / total);
			let newMovers = [];

			for(let i = 0; i < this.movers.length; i++) {
				let partnerA = this.movers[this.pickOne(normalizedFitness)].dna;
				let partnerB = this.movers[this.pickOne(normalizedFitness)].dna;
				let child = partnerA.crossover(partnerB);
				child.mutate(this.mutationrate);
				newMovers[i] = new Mover(this.loc.copy(), child);
			}
			this.movers = newMovers;
			this.generation++;
		}

		pickOne(arr) {
			let r = p.random();
			let i = 0;
			while(r > 0)
				r -= arr[i++];
			return --i;
		}

		draw() {
			for(let i = 0; i < this.movers.length; i++) {
				this.movers[i].run();

				if(this.target.isColliding(this.movers[i].loc)) {
					this.movers[i].stop();
					this.movers[i].fitness *= 2;
				}

				for(let j = 0; j < this.obstacles.length; j++)
					if(this.obstacles[j].isColliding(this.movers[i].loc)) {
						this.movers[i].fitness *= 0.1;
						this.movers[i].stop();
					}
			}
		}

		setObstacles(ob) {
			this.obstacles = ob;
		}

		getGeneration() {
			return this.generation;
		}

		getFitness() {
			return this.averageFitness * 100;
		}

		getPopulation() {
			return this.movers.length;
		}
	}

	let mPop;
	let obstacles = [];
	let target;
	let mutationRate = 0.01;
	let populationCount = 300;
	let lifetime = 300;
	let lifecycle = 0;


	p.setup = () => {
		p.createCanvas(600, 600);
		p.rectMode(p.CENTER);

		target = new Target(570, 300, 30, 30);

		mPop = new Population(p.createVector(10, 300), mutationRate, populationCount, target);

		obstacles.push(new Obstacle(200, 300, 15, 150));
		obstacles.push(new Obstacle(400, 125, 15, 250));
		obstacles.push(new Obstacle(400, 475, 15, 250));

		mPop.setObstacles(obstacles);
	}

	p.draw = () => {
		p.background(255);
		p.noStroke();
		if(lifecycle < lifetime) {
			lifecycle++;
		} else {
			lifecycle = 0;
			mPop.calcFitness();
			mPop.reproduction();
		}

		target.draw();
		for(let i = 0; i < obstacles.length; i++)
			obstacles[i].draw();
		mPop.draw();

		p.fill(0);
		p.text(`Generation : ${mPop.getGeneration()}`, 5, 15);
		p.text(`Average Fitness : ${mPop.getFitness()}`, 5, 30);
		p.text(`Population : ${mPop.getPopulation()}`, 5, 45);
		p.text(`Mutation : ${mutationRate * 100}%`, 5, 60);
	}
}
