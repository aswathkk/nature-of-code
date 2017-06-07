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

			if(this.loc.y > p.height / 2 - this.radius) {
				this.vel.y *= -1;
				this.loc.y = p.height / 2 - this.radius;
			} else if(this.loc.y < this.radius) {
				this.vel.y *= -1;
				this.loc.y = this.radius;
			}
		}

		isGoingThrough(x1, y1, x2, y2) {
			return (this.loc.x > x1 && this.loc.x < x1 + x2) || (this.loc.y > y1 && this.loc.y < y1 + y2);
		}
	}

	let ball, key;

	p.setup = () => {
		p.createCanvas(500, 500);
		ball = new Ball(p.width / 2, p.height / 2, 3);
	}

	p.draw = () => {
		p.background(200);

		if(key === p.RIGHT_ARROW)
			ball.applyForce(p.createVector(.5, 0));
		
		if(key === p.LEFT_ARROW)
			ball.applyForce(p.createVector(-.5, 0));

		let gravity = p.createVector(0, .4);
		ball.applyForce(gravity);

		if(ball.isGoingThrough(170, p.height / 2, 50, 10)) {
			let groundFriction = ball.vel.copy();
			groundFriction.normalize();
			groundFriction.mult(-1);
			ball.applyForce(groundFriction);
		} else {
			let redFriction = ball.vel.copy();
			redFriction.normalize();
			redFriction.mult(-0.1);
			ball.applyForce(redFriction);
		}

		ball.move();
		ball.bounce();
		ball.draw();

		p.fill(0);
		p.rect(0, p.height / 2, p.width, p.height);

		p.fill(255, 0, 0);
		p.rect(170, p.height / 2, 50, 10);
	}

	p.keyPressed = () => {
		key = p.keyCode;
		return false;
	}

	p.keyReleased = () => {
		key = 0;
		return false;
	}
}