module.exports = function (p) {

	class Tree {
		constructor(x, y) {
			this.x = x;
			this.y = y;
			this.len = 100;
			this.theta = p.PI / 14;
		}

		branch(len) {

			p.strokeWeight(len * .1);
			p.line(0, 0, 0, -len);
			p.translate(0, -len);

			len *= 0.6;

			if(len > 2) {
				p.push();
				p.rotate(this.theta);
				this.branch(len);
				p.pop();

				p.push();
				p.rotate(-this.theta);
				this.branch(len);
				p.pop();
			}

		}

		draw() {
			p.push();
			p.translate(this.x, this.y);
			this.branch(this.len);
			p.pop();
		}
	}
	
	let tree;
	let t = 0;

	p.setup = () => {
		p.createCanvas(600, 600);
		tree = new Tree(p.width / 2, p.height / 2 + 100);
	}

	p.draw = () => {
		p.background(255, 152, 0);

		t += 0.001;
		let angle = p.map(p.noise(t), 0, 1, p.PI/15, p.PI/4);
		tree.theta = angle;
		tree.draw();

		p.fill(0);
		p.rect(0, p.height / 2 + 100, p.width, p.height / 2 - 100);
	}
}