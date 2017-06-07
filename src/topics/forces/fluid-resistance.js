module.exports = function (p) {

	class Ball {
		constructor(x, y, size) {
			this.loc = p.createVector(x, y);
			this.vel = p.createVector(0, 0);
			this.acc = p.createVector(0, 0);
			this.mass = size;
			this.radius = size * 15 / 2;
		}

		move() {
			this.vel.add(this.acc);
			this.loc.add(this.vel);
			this.acc.mult(0);
		}

		applyForce(force) {
			let f = p5.Vector.div(force, this.mass);
			this.acc.add(f);
		}

		draw() {
			p.fill(255);
			p.ellipse(this.loc.x, this.loc.y, this.mass * 15);
		}

		bounce() {
			if(this.loc.x > p.width - this.radius) {
				this.vel.x *= -1;
				this.loc.x = p.width - this.radius;
			} else if(this.loc.x < this.radius) {
				this.vel.x *= -1;
				this.loc.x = this.radius;
			}

			if(this.loc.y > p.height - this.radius) {
				this.vel.y *= -1;
				this.loc.y = p.height - this.radius;
			} else if(this.loc.y < this.radius) {
				this.vel.y *= -1;
				this.loc.y = this.radius;
			}
		}
	}

	class Fluid {
		constructor(x, y, w, h, c) {
			// Rectangle
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;

			// coefficient of drag
			this.c = c;
		}

		draw() {
			p.rect(this.x, this.y, this.w, this.h);
		}

		contains(x, y) {
			return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
		}

		getDragForce(vel) {
			// drag force = - c * |v|^2 * v_cap
			let force = vel.copy();
			force.normalize();
			force.mult(-1 * this.c * vel.mag() * vel.mag());
			return force;
		}
	}

	let ball = new Array();
	let fluid = new Array();

	p.setup = () => {
		p.createCanvas(500, 500);
		ball.push(new Ball(p.width / 4, 15, 3));
		ball.push(new Ball(3 * p.width / 4, 15, 3));
		fluid.push(new Fluid(0, p.height / 2, p.width / 2, p.height / 2, .2));
		fluid.push(new Fluid(p.width / 2, p.height / 2, p.width / 2, p.height / 2, .01));
	}

	p.draw = () => {
		p.background(0, 100, 200);

		let gravity = p.createVector(0, .4);

		for(let i = 0; i < ball.length; i++) {
			if(i == 0)
				p.fill(0);
			else
				p.fill(127);
			fluid[i].draw();

			ball[i].applyForce(gravity);

			p.fill(255);
			ball[i].move();
			ball[i].bounce();
			ball[i].draw();

			if(fluid[i].contains(ball[i].loc.x, ball[i].loc.y)) {
				ball[i].applyForce(fluid[i].getDragForce(ball[i].vel));
			}
		}
	}
}