module.exports = function (p) {

	class GameOfLife {
		constructor() {
			this.res = 5;

			this.row = p.width / this.res;
			this.col = p.height / this.res;

			this.cells = [];
			for(let i = 0; i < this.row; i++) {
				this.cells[i] = [];
				for(let j = 0; j < this.col; j++) {
					this.cells[i][j] = p.floor(p.random(0, 2));
				}
			}
		}

		generate() {
			let next = [];
			for(let i = 0; i < this.row; i++) {
				next[i] = [];
				for(let j = 0; j < this.col; j++) {

					let neighbors = 0;

					for(let k = -1; k < 2; k++)
						for(let l = -1; l < 2; l++)
							neighbors += this.cells[(i + k + this.row) % this.row][(j + l + this.col) % this.col];

					neighbors -= this.cells[i][j];

					// Game of life rules:
					if(this.cells[i][j] == 1 && (neighbors > 3 || neighbors < 2))	// Overpopulate & under populate
						next[i][j] = 0;
					else if(this.cells[i][j] == 0 && neighbors === 3) // reproduction
						next[i][j] = 1;
					else
						next[i][j] = this.cells[i][j];
				}
			}
			this.cells = next;
		}

		draw() {
			p.stroke(0, 50);
			for(let i = 0; i < this.row; i++) {
				for(let j = 0; j < this.col; j++) {
					p.fill(255);
					if(this.cells[i][j] == 1)
						p.fill(0);
					p.rect(i * this.res, j * this.res, this.res, this.res);
				}
			}
		}
	}
	
	let gl;

	p.setup = () => {
		p.createCanvas(400, 400);
		p.frameRate(5);
		gl = new GameOfLife();
	}

	p.draw = () => {
		p.background(255);
		gl.draw();
		gl.generate();
	}
}