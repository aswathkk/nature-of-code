module.exports = function (p) {

	class Ball {
		constructor(x, y, size) {
			this.loc = p.createVector(x, y);
			this.size = size;
			this.vel = p.createVector(2, -3);
			this.radius = size / 2;
		}

		move() {
			this.loc.add(this.vel);

			let radius = this.size / 2;
			this.loc.x = p.constrain(this.loc.x, radius, p.width - radius);
			this.loc.y = p.constrain(this.loc.y, radius, p.height - radius);
		}

		bounce() {
			if((this.loc.x >= p.width - this.radius) || (this.loc.x <= this.radius))
				this.vel.x *= -1;
			if((this.loc.y >= p.height - this.radius) || (this.loc.y <= this.radius))
				this.vel.y *= -1;
		}

		draw() {
			p.ellipse(this.loc.x, this.loc.y, this.size)
		}
	}

	let ball;

	p.setup = () => {
		p.createCanvas(600, 600);
		ball = new Ball(p.width / 2, p.height / 2, 30);
	}

	p.draw = () => {
		p.background(200);
		ball.move();
		ball.bounce();
		ball.draw();
	}
}