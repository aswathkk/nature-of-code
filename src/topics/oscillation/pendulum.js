module.exports = function (p) {

	class Pendulum {
		constructor(x, y, len, mass) {
			this.len = len;
			this.mass = mass;
			this.angle = 0;
			this.aVelocity = 0;
			this.aAcceleration = 0;

			this.origin = p.createVector(x, y);
			this.bob = p.createVector(this.origin.x + (len * p.sin(this.angle)), this.origin.y + (len * p.cos(this.angle)));

			this.drag = false;
		}

		draw() {
			
			if(this.draggable())
				p.fill(175);
			else
				p.fill(255);

			if(this.drag) {
				let d = p5.Vector.sub(this.origin, p.createVector(p.mouseX, p.mouseY));
				this.angle = - d.heading() - p.radians(90);
			}

			p.line(this.origin.x, this.origin.y, this.bob.x, this.bob.y);
			p.ellipse(this.bob.x, this.bob.y, this.mass * 10);
		}

		update() {
			this.bob = p.createVector(this.origin.x + (this.len * p.sin(this.angle)), this.origin.y + (this.len * p.cos(this.angle)));

			this.aAcceleration = (-0.6 / this.len) * p.sin(this.angle);

			this.aVelocity += this.aAcceleration;
			this.aVelocity *= .99;
			this.angle += this.aVelocity;
		}

		draggable() {
			let mouse = p.createVector(p.mouseX, p.mouseY);
			let d = p5.Vector.sub(mouse, this.bob).mag();
			return d < this.mass * 5;
		}

		startDrag() {
			if(this.draggable())
				this.drag = true;
		}

		stopDrag() {
			this.drag = false;
		}

	}

	let pendulum = new Array();

	p.setup = () => {
		p.createCanvas(600, 600);
		for(let i = 0; i < 10; i++)
			pendulum.push(new Pendulum(i * p.width / 10 + 25, 0, p.random(10, 400), 4));
	}

	p.draw = () => {
		p.background(250);

		p.stroke(0)
		p.fill(255, 200);
		for(let i = 0; i < pendulum.length; i++) {
			pendulum[i].draw();
			pendulum[i].update();
		}

	}

	p.mousePressed = () => {
		for(let i = 0; i < pendulum.length; i++)
			pendulum[i].startDrag();
	}

	p.mouseReleased = () => {
		for(let i = 0; i < pendulum.length; i++)
			pendulum[i].stopDrag();
	}
}
