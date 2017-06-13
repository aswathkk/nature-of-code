module.exports = function (p) {

	class Vehicle {
		constructor(x, y) {
			this.loc = new p.createVector(x, y);

			this.maxSpeed = 6;
			this.maxForce = .1;

			this.vel = new p.createVector(p.random(), p.random());
			this.acc = new p.createVector(0, 0);
		}

		draw() {
			p.fill(233, 30, 99);
			p.stroke(233, 30, 99);

			p.push();
			p.translate(this.loc.x, this.loc.y);
			p.rotate(this.vel.heading());
			p.triangle(-5, -5, -5, 5, 10, 0);
			p.pop();
		}

		update() {
			this.vel.add(this.acc);
			this.vel.limit(this.maxSpeed);
			this.loc.add(this.vel);

			this.acc.mult(0);
		}

		run() {
			this.draw();
			this.update();
			this.edge();
		}

		applyForce(force) {
			this.acc.add(force);
		}

		// Calculate and apply steering force towards the target
		follow(flow) {
			let desired = flow.lookup(this.loc);
			
			desired.setMag(this.maxSpeed);
			
			let steer = p5.Vector.sub(desired, this.vel);
			steer.limit(this.maxForce);
			
			this.applyForce(steer);
		}

		edge() {
			if(this.loc.x < 0)
				this.loc.x = p.width;
			else if(this.loc.x > p.width)
				this.loc.x = 0;

			if(this.loc.y < 0)
				this.loc.y = p.height;
			else if(this.loc.y > p.height)
				this.loc.y = 0;
		}
	}

	class FlowField {
		constructor() {
			this.resolution = 50;
			this.row = p.height / this.resolution;
			this.col = p.width / this.resolution;

			// time value for perlin noise
			let xt = 0, yt = 0;

			// creating field at each cells
			this.field = [];
			for(let x = 0; x < this.col; x++) {
				xt = 0;
				this.field[x] = [];

				for(let y = 0; y < this.row; y++) {
					let a = p.map(p.noise(xt, yt), 0, 1, 0, p.TWO_PI);
					this.field[x][y] = p.createVector(p.cos(a), p.sin(a));
					xt += 0.1;
				}

				yt += 0.1;
			}
		}

		// get the vector at location
		lookup(loc) {
			let col = p.floor(p.constrain(loc.x / this.resolution, 0, this.col - 1));
			let row = p.floor(p.constrain(loc.y / this.resolution, 0, this.row - 1));

			return this.field[col][row].copy();
		}

		draw() {
			p.stroke(103, 58, 183);
			for(let x = 0; x < this.col; x++)
				for(let y = 0; y < this.row; y++) {
					p.push();
					p.translate(this.resolution * x + this.resolution / 2, this.resolution * y + this.resolution / 2);
					p.rotate(this.field[x][y].heading());
					p.line(-10, 0, 10, 0);
					p.line(10, 0, 7, -3);
					p.line(10, 0, 7, 3);
					p.pop();
				}
		}
	}

	let vehicles = [];
	let mouse;
	let field;
	let debug = false;

	p.setup = () => {
		p.createCanvas(600, 600);

		for(let i = 0; i < 50; i++)
			vehicles.push(new Vehicle(p.random(0, p.width), p.random(0, p.height)));

		field = new FlowField();
	}

	p.draw = () => {
		p.background(255);

		mouse = p.createVector(p.mouseX, p.mouseY);

		for(let i = vehicles.length - 1; i >= 0; i--) {
			vehicles[i].follow(field);
			vehicles[i].run();
		}

		if(debug)
			field.draw();
	}

	p.mousePressed = () => {
		debug = !debug;
		vehicles.push(new Vehicle(p.mouseX, p.mouseY));
	}
}
