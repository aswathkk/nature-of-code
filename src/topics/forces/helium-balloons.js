module.exports = function (p) {
window.p = p;
	class Balloon {
		constructor(x, y, size) {
			this.loc = p.createVector(x, y);
			this.size = size;
			this.vel = p.createVector(0, 0);
			this.radius = size / 2;
			this.force = p.createVector(0, 0);
		}

		move() {
			this.vel.add(this.force);
			this.loc.add(this.vel);

			this.loc.x = p.constrain(this.loc.x, this.radius, p.width - this.radius);
			this.loc.y = p.constrain(this.loc.y, this.radius, p.height - this.radius);

			this.force.mult(0);
		}

		bounce() {
			if((this.loc.x >= p.width - this.radius) || (this.loc.x <= this.radius))
				this.vel.x *= -.2;
			if((this.loc.y >= p.height - this.radius) || (this.loc.y <= this.radius))
				this.vel.y *= -.2;
		}

		draw() {
			// p.stroke(255, 0, 0);
			p.fill(233,30,99);
			p.line(this.loc.x, this.loc.y, this.loc.x, this.loc.y + 100);
			p.ellipse(this.loc.x, this.loc.y, this.size);
		}

		applyForces(force) {
			this.force.add(force);
		}
	}

	let balloons = new Array();
	let helium = new Array();
	let n = 20;

	p.setup = () => {
		p.createCanvas(600, 600);
		for(let i = 0; i < n; i++) {
			 balloons.push(new Balloon(p.random(0, p.width), p.height / 2, 60));
			 helium.push(p.createVector(0, p.random(-.4, -.31)))
		}
	}

	let gravity = p.createVector(0, .3);
	let t = 0;
	p.draw = () => {
		p.background(238);

		t += .1;
		let s = p.map(p.noise(t), 0, 1, -0.001, 0.001);
		let wind = p.createVector(s, 0);
		for(let i = 0; i < n; i++) {

			balloons[i].applyForces(helium[i]);
			balloons[i].applyForces(wind);
			balloons[i].applyForces(gravity);

			balloons[i].move();
			balloons[i].bounce();
			balloons[i].draw();
		}
		
	}
}