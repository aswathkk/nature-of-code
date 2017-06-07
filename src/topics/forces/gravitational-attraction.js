module.exports = function (p) {
	
	class Ball {
		constructor(x, y, size) {
			this.loc = p.createVector(x, y);
			this.vel = p.createVector(0, 0);
			this.acc = p.createVector(0, 0);
			this.mass = size;
			this.radius = size * 15 / 2;
			this.path = new Array();
			window.q = this.path;
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
			p.ellipse(this.loc.x, this.loc.y, this.mass * 15);
			for(let i = 0; i < this.path.length; i++)
				p.point(this.path[i].x, this.path[i].y);
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

		// apply an attractive force to object ob
		attract(ob) {
			// gravitational attraction = G * (m1 * m2) / (d * d) * r
			// r is the direction of force 
			let G = 1; // In the world of pixels, G should be tuned accordingly
			let r = p5.Vector.sub(this.loc, ob.loc); // vector pointing towards this.
			let d = r.mag(); // distance between ob and this
			d = p.constrain(d, 5, 25); // limiting the distance
			r.normalize(); // calculating unit vector r. ( direction of force )

			let strenght = (G * this.mass * ob.mass) / (d * d);
			r.mult(strenght);

			ob.applyForce(r);
		}
	}

	let star;
	let planets = new Array();

	p.setup = () => {
		p.createCanvas(500, 500);
		// creating the star
		star = new Ball(p.width / 2, p.height / 2, 5);
		
		// creating planets
		planets.push(new Ball(p.width / 2 + 75, p.height / 2, .5));
		planets.push(new Ball(p.width / 2 + 150, p.height / 2, 1));
		planets.push(new Ball(p.width / 2 + 200, p.height / 2, 2));

		// planets got some initial velocity
		planets[0].vel = p.createVector(0, 1);
		planets[1].vel = p.createVector(0, -1);
		planets[2].vel = p.createVector(.5, -1.25);

	}

	p.draw = () => {
		p.background(255);

		p.fill(255, 100, 10);
		star.move();
		star.draw();

		p.fill(127);
		for(let  i = 0; i < planets.length; i++) {
			// planets get attracted by star
			star.attract(planets[i]);

			// planet's attraction on star is negligible
			// planet's attraction on other planets also avoided for simplifying model

			planets[i].move();
			planets[i].draw();
		}
		
	}
}