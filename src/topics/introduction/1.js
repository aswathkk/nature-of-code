export default function randomWalkTowardsMouse(p) {
	class Walk {
		constructor(x, y) {
			this.x = x;
			this.y = y;

			this.pr = .25;
			this.pb = .25;
		}

		step() {
			let chance = p.random();

			this.pr = .25 + (p.mouseX - this.x) / (p.width * 4);
			this.pb = .25 + (p.mouseY - this.y) / (p.height * 4);

			if(chance < this.pr)
				this.x++;
			else if(chance < this.pr + this.pb)
				this.y++;
			else if(chance < this.pb + .5)
				this.x--;
			else
				this.y--;

			this.x = p.constrain(this.x, 0, p.width - 1);
			this.y = p.constrain(this.y, 0, p.height - 1);
		}

		render() {
			p.point(this.x, this.y);
		}
	}

	let walk;

	p.setup = () => {
		p.createCanvas(600, 600);
		p.background(255);
		walk = new Walk(p.width / 2, p.height / 2);
	}

	p.draw = () => {
		walk.step();
		walk.render();
	}
}