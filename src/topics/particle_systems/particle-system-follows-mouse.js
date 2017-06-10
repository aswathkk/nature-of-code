module.exports = function (p) {

	class Particle {
		constructor(loc) {
			this.lifeSpan = 255;
			this.velocity = p.createVector(p.random(-1.5, 1.5), p.random(-2, 0));
			this.acceleration = p.createVector(0, 0.04);

			this.loc = loc.copy();
		}

		draw() {
			p.fill(0, this.lifeSpan);
			p.stroke(0, this.lifeSpan);
			p.ellipse(this.loc.x, this.loc.y, 10);
		}

		update() {
			this.lifeSpan -= 2;
			this.velocity.add(this.acceleration);
			this.loc.add(this.velocity);
		}

		run() {
			this.update();
			this.draw();
		}

		isDead() {
			return this.lifeSpan < 0;
		}

		applyForce(force) {
			this.acceleration.add(force);
		}
	}

	class ParticleSystem {
		constructor(x, y) {
			this.loc = p.createVector(x, y);
			this.particles = new Array();

			this.vel = p.createVector(0, 0);
			this.acc = p.createVector(0, 0);
		}

		run() {
			let d = p5.Vector.sub(p.createVector(p.mouseX, p.mouseY), this.loc).normalize();
			this.acc = d;
			this.vel.add(this.acc);
			this.vel.limit(5);
			this.loc.add(this.vel);

			this.particles.push(new Particle(this.loc));
			for(let i = 0; i < this.particles.length; i++) {
				if(this.particles[i].isDead())
					this.particles.splice(i, 1);
				
				this.particles[i].run();
			}
		}
	}

	let ps;

	p.setup = () => {
		p.createCanvas(600, 600);
		
		ps = new ParticleSystem(p.width / 2, 100);

	}

	p.draw = () => {
		p.background(200);
		ps.run();
	}

}