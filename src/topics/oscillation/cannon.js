module.exports = function (p) {

	class Ball {
		constructor(x, y, size, mass) {
			this.loc = p.createVector(x, y);
			this.mass = mass;
			this.radius = size / 2;

			this.acceleration = p.createVector(0, 0);
			this.velocity = p.createVector(0, 0);
		}

		draw() {
			p.fill(0);
			p.ellipse(this.loc.x, this.loc.y, this.radius * 2);
		}

		update() {
			this.velocity.add(this.acceleration);
			this.loc.add(this.velocity);
			this.acceleration.mult(0);

			// check edges
			if(this.loc.x - this.radius < 0 || this.loc.x + this.radius > p.width)
				this.velocity.mult(-1);
		}

		applyForce(force) {
			let f = p5.Vector.div(force, this.mass);
			this.acceleration.add(f);
		}

		checkCollision(x, y, w, h) {
			// ground
			if(this.loc.y + this.radius > y && this.loc.x - this.radius < x + w) {
				this.loc.y = y - this.radius;
				this.velocity.mult(-1);
			}
		}
	}

	class Cannon {

		constructor(x, y) {
			this.loc = p.createVector(x, y);

			this.bodyRadius = 20;
			this.pipeRadius = 10;
			this.pipeLength = 40;

			this.angle = 0;
			this.angularVelociy = 0;
			this.angularAcceleration = 0;

			this.force = 10;

			this.ball = new Array();
		}

		draw() {
			// Cannon Ball
			for(let i = 0; i < this.ball.length; i++) {
				this.ball[i].draw();
				this.ball[i].update();
				let d = p5.Vector.sub(this.loc, this.ball[i].loc).mag();
				if(d > this.bodyRadius + this.pipeLength - this.ball[i].radius)
					this.ball[i].outside = true;
			}

			// Cannon Pipe
			p.fill(191,54,12);
			p.push();
			p.translate(this.loc.x , this.loc.y);
			p.rotate(p.radians(this.angle));
			p.rect(0, -this.pipeRadius, this.pipeLength, this.pipeRadius * 2);
			p.pop();

			// Cannon Body
			p.fill(251,140,0);
			p.ellipse(this.loc.x, this.loc.y, this.bodyRadius * 2);

			// Cannon trigger
			p.fill(10);
			p.push();
			p.translate(this.loc.x, this.loc.y);
			p.rotate(p.radians(this.angle))
			p.ellipse(-this.force/10, 0, this.pipeRadius);
			p.line(-this.force/10, 0, 0, 0);
			p.pop();
		}

		update() {
			this.angle += this.angularVelociy;
			this.angularVelociy += this.angularAcceleration;
			this.angle = p.constrain(this.angle, -180, 0);
			let i = this.ball.length - 1;
			if(this.ball.length === 0)
				i = 0;
			this.ball[i] = new Ball(this.loc.x, this.loc.y, this.pipeRadius * 2 - 1, 10);
		}

		shoot() {
			let ball = this.ball[this.ball.length - 1];
			let force = p.createVector(p.cos(p.radians(this.angle)), p.sin(p.radians(this.angle)));
			force.mult(this.force);
			ball.applyForce(force);

			this.ball.push(new Ball(this.loc.x, this.loc.y, this.pipeRadius * 2 - 1, 10));

			this.force = 10;
			
			return ball;
		}

		trigger(val) {
			this.force += val;
			this.force = p.constrain(this.force, 10, 250);
		}
	}

	let cannon;
	let usedBalls = new Array();
	let gravity = p.createVector(0, .5);
	let trigger = false;

	p.setup = () => {
		p.createCanvas(600, 600);
		
		cannon = new Cannon(300, 2 * p.height / 3 + 5);
	}

	p.draw = () => {
		p.background(3,169,244);
		p.stroke(0,0);

		p.fill(93,64,55);
		p.rect(0, 2 * p.height / 3 + 20, 2 * p.width / 3, p.height / 3);

		let locX = p.constrain(p.mouseX, cannon.bodyRadius, 2 * p.width / 3 - cannon.bodyRadius);
		cannon.loc.x = locX;
		cannon.draw();
		cannon.update();

		for(let i = 0; i < usedBalls.length; i++) {
			if(usedBalls[i].outside) {
				// Apply air resistance			
				let force = usedBalls[i].velocity.copy();
				force.normalize();
				let v = usedBalls[i].velocity.mag();
				force.mult(-.1 * v * v);
				usedBalls[i].applyForce(force);

				// Apply gravity
				usedBalls[i].applyForce(gravity);
				usedBalls[i].checkCollision(0, 2 * p.height / 3 + 20, 2 * p.width / 3, p.height / 3);
			}
		}

		if(trigger)
			cannon.trigger(5);

		showInfo();
	}

	p.keyPressed = () => {
		if(p.keyCode === p.LEFT_ARROW)
			cannon.angularAcceleration = -0.1;
		if(p.keyCode === p.RIGHT_ARROW)
			cannon.angularAcceleration = 0.1;
		if(p.keyCode === p.UP_ARROW)
			trigger = true;
		return false;
	}

	p.keyReleased = () => {
		if(p.keyCode === p.UP_ARROW) {
			trigger = false;
			usedBalls.push(cannon.shoot());
		}

		cannon.angularAcceleration = 0;
		cannon.angularVelociy = 0;
		return false;
	}

	function showInfo() {
		p.fill(255);
		p.text(`Use LEFT and RIGHT arrows to rotate cannon chase. Hold UP arrow to adjust power and relese to fire`, 25, 20);
		p.text(`Use mouse to control cannon's location`, 200, 40);
	}
}
