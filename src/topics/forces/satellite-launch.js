module.exports = function (p) {

	class Ball {
		constructor(x, y, mass) {
			this.loc = p.createVector(x, y);
			this.mass = mass;
			this.vel = p.createVector(0, 0);
			this.acc = p.createVector(0, 0);
			this.radius = this.mass * 10;
		}

		draw() {
			p.ellipse(this.loc.x, this.loc.y, this.mass * 20);
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

		attract(ob) {
			let r = p5.Vector.sub(this.loc, ob.loc);
			let d = r.mag();
			d = p.constrain(d, 1, 5);
			r.normalize();
			let strength = (0.1 * this.mass * ob.mass) / (d * d);
			r.mult(strength);
			ob.applyForce(r);
		}
	}

	let earth, satellite;
	p.setup = () => {
		p.createCanvas(600, 600);

		earth = new Ball(p.width / 2, p.height / 2, 5);
		satellite = new Ball(p.width / 2, p.height / 2 - (55), .25);

	}

	let key;

	p.draw = () => {
		p.background(255);

		p.fill(0, 100, 255);
		p.stroke(0, 100, 255);
		earth.draw();

		if(key === p.LEFT_ARROW)
			satellite.acc.x -= .1;
		if(key === p.RIGHT_ARROW)
			satellite.acc.x += .1;
		if(key === p.UP_ARROW)
			satellite.acc.y -= .1;
		if(key === p.DOWN_ARROW)
			satellite.acc.y += .1;

		let d = p5.Vector.sub(earth.loc, satellite.loc).mag();
		if(d < earth.mass * 20 + 15 + satellite.radius) {
			// inside earth's atmosphere

			// applying air resistance
			let airRes = satellite.vel.copy();
			airRes.normalize();
			airRes.mult(-0.01 * satellite.vel.mag() * satellite.vel.mag())
			satellite.applyForce(airRes);

			// touching earth's surface
			if(d < earth.radius + satellite.radius)
				satellite.vel.mult(-1);
			else
				earth.attract(satellite);

			p.fill(0, 100, 255, 50);
		}
		else {
			earth.attract(satellite);
			p.fill(0, 100, 255, 30);
		}


		// earth's atmosphere
		p.stroke(0, 100, 255, 30);
		p.ellipse(earth.loc.x, earth.loc.y, earth.mass * 20 + 150);


		p.fill(255, 0, 0);
		p.stroke(255, 0, 0);
		satellite.draw();
		satellite.move();

		// show instructions
		instructions();
	}

	p.keyPressed = () => {
		key = p.keyCode;
		return false;
	}

	p.keyReleased = () => {
		key = 0;
		return false;
	}

	let instructions = () => {
			p.fill(0, 100, 255);
			p.stroke(0, 100, 255);
			p.ellipse(10, 10, 10);
			p.stroke(255);
			p.fill(127);
			p.text("Earth", 20, 14);

			p.fill(0, 100, 255, 30);
			p.stroke(0, 100, 255, 30);
			p.ellipse(100, 10, 10);
			p.stroke(255);
			p.fill(127);
			p.text("Earth's Atomsphere", 110, 14);

			p.fill(255, 0, 0);
			p.stroke(255, 0, 0);
			p.ellipse(240, 10, 10);
			p.stroke(255);
			p.fill(127);
			p.text("Satellite", 250, 14);

			p.text("Use Keyboard arrows to control satellite's acceleration", 150, p.height - 20);
	}

}