module.exports = function (p) {

	class Particle {
		constructor(loc) {
			this.loc = loc.copy();

			this.vel = p.createVector(p.random(-1, 1), p.random(-1, 0));
			this.acc = p.createVector(0, 0);

			this.color = [p.random(0, 255), p.random(0, 255), p.random(0, 255)];
			this.life = 255;
		}

		draw() {
			p.fill(...this.color, this.life);
			p.stroke(...this.color, this.life);
			p.ellipse(this.loc.x, this.loc.y, 10);
		}

		update() {
			this.vel.add(this.acc);
			this.loc.add(this.vel);

			this.acc.mult(0);
			this.life -= 1;
		}

		run() {
			this.draw();
			this.update();
		}

		isDead() {
			return this.life < 0;
		}

		applyForce(force) {
			this.acc.add(force);
		}
	}

	class ParticleSystem {
		constructor(loc) {
			this.loc = loc.copy();

			this.particles = new Array();
			window.ps = this.particles;
		}

		run() {
			this.particles.push(new Particle(p.createVector(p.width / 2, 100)));
			for(let i = 0; i < this.particles.length; i++) {
				let particle = this.particles[i];
				particle.run();

				if(particle.isDead())
					this.particles.splice(i, 1);
			}
		}

		applyForce(force) {
			for(let i = 0; i < this.particles.length; i++)
				this.particles[i].applyForce(force);
		}

		applyRepeller(repeller) {
			for(let i = 0; i < this.particles.length; i++)
				this.particles[i].applyForce(repeller.repell(this.particles[i]));
		}
	}

	class Repeller {
		constructor() {
			this.loc = p.createVector(300, 200);
			this.radius = 10;
		}

		draw() {
			this.loc = p.createVector(p.mouseX, p.mouseY);
			p.ellipse(this.loc.x, this.loc.y, this.radius * 5);
		}

		repell(ob) {
			let dir = p5.Vector.sub(this.loc, ob.loc);
			let d = dir.mag();
			d = p.constrain(d, 1, 1000);
			dir.normalize();
			dir.mult(-100 / (d * d));
			return dir;
		}
	}

	let ps, gravity, repeller;

	p.setup = () => {
		p.createCanvas(600, 600);

		ps = new ParticleSystem(p.createVector(p.width / 2, 100));
		gravity = p.createVector(0, 0.02);
		repeller = new Repeller();
	}

	p.draw = () => {
		p.background(255);

		ps.applyForce(gravity);
		ps.applyRepeller(repeller);
		ps.run();

		p.fill(233, 30, 99);
		p.stroke(233, 30, 99);
		repeller.draw();
	}

}