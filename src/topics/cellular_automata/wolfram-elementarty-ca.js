module.exports = function (p) {

	class CellularAutomata {
		constructor(ruleset) {
			this.ruleset = ruleset;

			// number of cells in each row
			this.len = 150;

			this.gen = 0;
			this.res = p.width / this.len;
			this.cells = new Array(this.len);

			// making every cell white
			for(let i = 0; i < this.cells.length; i++)
				this.cells[i] = 0;

			// making middle cell black
			this.cells[p.floor(this.len / 2)] = 1;
		}

		draw() {
			for(let i = 0; i < this.cells.length; i++) {
				p.noStroke(0);

				if(this.cells[i] == 0)
					p.fill(255);
				else
					p.fill(0);

				p.rect(i * this.res, this.gen * this.res, this.res, this.res);
			}
		}

		generate() {
			// new generation
			let newgen = new Array(this.cells.length);

			for(let i = 0; i < this.cells.length; i++) {
				
				let p = i - 1;
				// for the first cell, the previous neightbour is last cell
				if(i == 0)
					p = this.cells.length - 1;

				let n = i + 1;
				// for the last cell, next neighbour is the first cell
				if(i == this.cells.length - 1)
					n = 0;

				let prev = this.cells[p];
				let curr = this.cells[i];
				let next = this.cells[n];

				// calculating the decimal equivalent of binary number formed from neighbourhood
				let index = parseInt("" + prev + curr + next, 2);

				newgen[i] = this.ruleset[7 - index]
			}
			this.cells = newgen;
			this.gen++;
		}

		reset() {
			this.gen = 0;

			for(let i = 0; i < this.cells.length; i++)
				this.cells[i] = 0;

			this.cells[p.floor(this.len / 2)] = 1;
		}

		randomRuleset() {
			for(let i = 0; i < this.cells.length; i++)
				this.ruleset[i] = p.floor(p.random(0, 2));
		}
	}

	let ca;

	p.setup = () => {
		p.createCanvas(500, 500);
		p.background(255);

		let ruleset = [0,0,0,1,1,1,1,0];

		ca = new CellularAutomata(ruleset);
	}

	p.draw = () => {
		ca.draw();
		ca.generate();
	}

	p.mousePressed = () => {
		p.background(255);
		ca.reset();
		ca.randomRuleset();
	}
}