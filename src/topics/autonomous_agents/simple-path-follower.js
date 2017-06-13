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

		follow(path) {
			// predict location after 50 frames
			let nextVel = this.vel.copy();
			nextVel.setMag(50);
			let predict = p5.Vector.add(this.loc, nextVel);

			// calculate normal to the path. 
			let A = p5.Vector.sub(predict, path.start);
			let B = p5.Vector.sub(path.end, path.start);
			B.normalize();
			// projection from A to B
			let proj = B.mult(A.dot(B));
			let norm = p5.Vector.add(path.start, proj);

			let d = p5.Vector.sub(norm, predict).mag();

			if(d > path.radius) {
				B.setMag(10);
				let target = p5.Vector.add(norm, B);
				this.seek(target)
			}
			
			if(debug) {
				p.stroke(0);
				let next = this.vel.copy().mult(50);
				p.push();
				p.translate(this.loc.x, this.loc.y);
				p.line(0, 0, nextVel.x, nextVel.y);
				p.pop();

				p.strokeWeight(10);
				p.stroke(233, 30, 99, 100);
				p.point(norm.x, norm.y);

				p.strokeWeight(1);
			}
		}

		edge(path) {
			// console.log(path)
			if(this.loc.x > path.end.x + path.radius) {
				this.loc.x = path.start.x - path.radius;
				this.loc.y = path.start.y + this.loc.y - path.end.y;
			}
		}
	}

	class Path {
		constructor(x1, y1, x2, y2) {
			this.radius = 20;

			this.start = p.createVector(x1, y1);
			this.end = p.createVector(x2, y2);
		}

		draw() {
			p.strokeWeight(this.radius * 2);
			p.stroke(200, 100);
			p.line(this.start.x, this.start.y, this.end.x, this.end.y);

			p.strokeWeight(1);
			p.stroke(0);
			p.line(this.start.x, this.start.y, this.end.x, this.end.y);

			p.fill(0);
			p.stroke(0, 0);
		}
	}
	

	let vehicles = [];
	let mouse;
	let path;
	let debug = false;

	p.setup = () => {
		p.createCanvas(600, 600);

		for(let i = 0; i < 1; i++)
			vehicles.push(new Vehicle(p.random(0, p.width), p.random(0, p.height)));

		path = new Path(0, 100, p.width, p.height - 300);
	}

	p.draw = () => {
		p.background(255);

		mouse = p.createVector(p.mouseX, p.mouseY);

		for(let i = 0; i < vehicles.length; i++) {
			vehicles[i].follow(path);
			vehicles[i].edge(path);
			vehicles[i].run();
		}

		path.draw();
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
