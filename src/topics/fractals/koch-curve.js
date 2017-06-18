module.exports = function (p) {

	class KochLine {
		/*
			    c
			    /\
			   /  \
		a____b/    \d____e
		
		*/
		constructor(start, end) {
			this.start =  start;
			this.end = end;
		}

		pointA() {
			return this.start;
		}

		pointB() {
			let v = p5.Vector.sub(this.end, this.start);
			v.div(3);
			v.add(this.start);
			return v;
		}

		pointC() {
			let v = p5.Vector.sub(this.end, this.start);
			v.div(3);
			v.rotate(-p.PI / 3);
			v.add(this.pointB());
			return v;
		}

		pointD() {
			let v = p5.Vector.sub(this.end, this.start);
			v.mult(2 / 3);
			v.add(this.start);
			return v;
		}

		pointE() {
			return this.end;
		}
	}

	class KochCurve {
		constructor(x1, y1, x2, y2) {
			this.start = p.createVector(x1, y1);
			this.end = p.createVector(x2, y2);
			this.points = [this.start, this.end];
		}

		generate() {
			let line = [];

			for (let i = 0; i < this.points.length - 1; i++) {
				let kl = new KochLine(this.points[i], this.points[i + 1]);
				line.push(kl.pointA());
				line.push(kl.pointB());
				line.push(kl.pointC());
				line.push(kl.pointD());
				line.push(kl.pointE());
			}

			this.points = line;
		}

		draw() {
			for (let i = 0; i < this.points.length - 1; i++) {
				p.line(this.points[i].x, this.points[i].y, this.points[i + 1].x, this.points[i + 1].y);
			}
		}
	}

	class KochSnowFlake {
		constructor(x, y, len = 100) {
			this.kLines = [];
			for(let i = 0; i < 360; i+= 60)
				this.kLines.push(new KochCurve(x + len * p.cos(p.radians(i + 60)), y + len * p.sin(p.radians(i + 60)), x + len * p.cos(p.radians(i)), y + len * p.sin(p.radians(i))));
		}

		generate() {
			for(let i = 0; i < this.kLines.length; i++)
				this.kLines[i].generate();
		}

		draw() {
			for(let i = 0; i < this.kLines.length; i++)
				this.kLines[i].draw();
		}
	}
	
	let snowFlake;
	let a = 0;

	p.setup = () => {
		p.createCanvas(600, 600);
		snowFlake = new KochSnowFlake(p.width / 2, p.height / 2, 200);
		for(let i = 0; i < 3; i++)
			snowFlake.generate();
	}

	p.draw = () => {
		p.background(200);

		a += 0.01;
		p.push();
		p.translate(p.width / 2, p.height / 2);
		p.rotate(a);
		p.translate(-p.width / 2, -p.height / 2);
		snowFlake.draw();
		p.pop();
	}
}