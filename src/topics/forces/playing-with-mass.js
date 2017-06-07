module.exports = function (p) {

	class Ball {
		constructor(x, y, mass) {
			this.loc = p.createVector(x, y);
			this.mass = mass;
			this.vel = p.createVector(0, 0);
			this.acc = p.createVector(0, 0);
		}

		move() {
			this.vel.add(this.acc);
			this.loc.add(this.vel);
			this.acc.mult(0);
		}

		applyForces(force) {
			let f = p5.Vector.div(force, this.mass);
			this.acc.add(f);
		}

		draw() {
			p.ellipse(this.loc.x, this.loc.y, this.mass);
		}

		bounce() {
			if(this.loc.x > p.width) {
				this.vel.x *= -1;
				this.loc.x = p.width;
			} else if(this.loc.x < 0) {
				this.vel.x *= -1;
				this.loc.x = 0;
			}

			if(this.loc.y > p.height) {
				this.vel.y *= -1;
				this.loc.y = p.height;
			} else if(this.loc.y < 0) {
				this.vel.y *= -1;
				this.loc.y = 0;
			}
		}
	}

	let ball = new Array();
	let n = 10;

	p.setup = () => {
		p.createCanvas(400, 400);
		// p.frameRate(5);
		for(let i = 0; i < n; i++)
			ball.push(new Ball(0, 0, p.random(20, 70)));
	}

	p.draw = () => {
		p.background(255);
		p.fill(127, 100);
		for(let i = 0; i < n; i++) {
			let gravity = p.createVector(0, .3);
			gravity.mult(ball[i].mass);
			ball[i].applyForces(gravity);

			let wind = p.createVector(.3, 0);
			ball[i].applyForces(wind);

			ball[i].move();
			ball[i].bounce();
			ball[i].draw();
		}
		
	}
}