module.exports = function (p) {

	class Mover{
		constructor(x, y) {
			this.loc = p.createVector(x, y);

			this.acc = p.createVector(0, 0);
			this.vel = p.createVector(0, 0);
			this.tail = new Array();
		}

		draw() {
			p.push();
			p.translate(this.loc.x, this.loc.y);
			p.rotate(this.vel.heading());
			p.triangle(5, -10, 25, 0, 5, 10);
			p.pop();

			for(let i = 0; i < this.tail.length; i++)
				p.ellipse(this.tail[i].x, this.tail[i].y, 5);
		}

		update() {
			this.vel.add(this.acc);
			this.vel.limit(7)
			this.loc.add(this.vel);

			let mouse = p.createVector(p.mouseX, p.mouseY);
			let dir = p5.Vector.sub(mouse, this.loc)
			dir.normalize();
			this.acc = dir;
			this.tail.push(p.createVector(this.loc.x, this.loc.y));
			if(this.tail.length > 10)
				this.tail.shift();
		}
	}

	let mover;

	p.setup = () => {
		p.createCanvas(600, 600);

		mover = new Mover(p.width / 2, p.height / 2);
	}

	p.draw = () => {
		p.background(3,169,244);
		p.fill(255);
		p.stroke(255);

		mover.draw();
		mover.update();
	}
}
