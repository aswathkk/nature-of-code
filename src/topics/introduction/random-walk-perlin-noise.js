module.exports = function (p) {
	class Walk {
		constructor(x, y) {
			this.x = x;
			this.y = y;

			this.tx = 0;
			this.ty = 1000;
		}

		step() {
			this.x = p.map(p.noise(this.tx), 0, 1, 0, p.width);
			this.y = p.map(p.noise(this.ty), 0, 1, 0, p.height);

			this.x = p.constrain(this.x, 0, p.width - 1);
			this.y = p.constrain(this.y, 0, p.height - 1);

			this.tx += .001;
			this.ty += .001;
		}

		render() {
			p.point(this.x, this.y, 50, 50);
		}
	}

	let walk;

	p.setup = () => {
		p.createCanvas(600, 600);
		walk = new Walk(p.width / 2, p.height / 2);
	}

	p.draw = () => {
		walk.step();
		walk.render();
	}
}