module.exports = function (p) {

	class Vehicle {
		constructor(x, y) {
			this.loc = new p.createVector(x, y);

			this.maxSpeed = 6;
			this.maxForce = .1;

			this.vel = new p.createVector(p.random(-1, 1), p.random(-1, 1));
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
		}

		applyForce(force) {
			this.acc.add(force);
		}

		seek(target) {
			let desired = p5.Vector.sub(target, this.loc);
			desired.setMag(this.maxSpeed);
			let steer = p5.Vector.sub(desired, this.vel);
			steer.limit(this.maxForce);
			this.applyForce(steer);
		}

		separate(vehicles) {
			let radius = 50;
			let sum = p.createVector(0, 0);
			let count = 0;

			for(let i = 0; i < vehicles.length; i++) {
				// distance from this vehicle to other vehicles
				let d = p5.Vector.dist(this.loc, vehicles[i].loc);
				// working out only on neighbours
				if(d > 0 && d < radius) {
					let dif = p5.Vector.sub(this.loc, vehicles[i].loc);
					dif.setMag(1 / d);
					sum.add(dif);
					count++;
				}
			}

			if(count > 0) {
				// Taking average
				sum.div(count);
				sum.setMag(this.maxSpeed);

				// desired velocity is the average of neighbour's velocity
				let steer = p5.Vector.sub(sum, this.vel);
				steer.limit(this.maxForce);
				this.applyForce(steer);
			}
		}

		edge(path) {
			if(this.loc.x > p.width)
				this.loc.x = 0;
			else if(this.loc.x < 0)
				this.loc.x = p.width;

			if(this.loc.y > p.height)
				this.loc.y = 0;
			else if(this.loc.y < 0)
				this.loc.y = p.height;
		}
	}

	let vehicles = [];
	let mouse;
	let debug = false;

	p.setup = () => {
		p.createCanvas(600, 600);

		for(let i = 0; i < 30; i++)
			vehicles.push(new Vehicle(p.random(0, p.width), p.random(0, p.height)));
	}

	p.draw = () => {
		p.background(255);

		mouse = p.createVector(p.mouseX, p.mouseY);

		for(let i = 0; i < vehicles.length; i++) {
			vehicles[i].separate(vehicles);
			vehicles[i].edge();
			vehicles[i].run();
		}
	}

	p.mousePressed = () => {
		vehicles.push(new Vehicle(p.mouseX, p.mouseY));
	}

	p.keyPressed = () => {
		if(p.key == ' ')
			debug = !debug;

		return false;
	}
}
