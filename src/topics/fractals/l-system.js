module.exports = function (p) {

	class LSystem {
		constructor(axiom, ruleset) {
			this.sentence = axiom;
			this.ruleset = ruleset;
			this.gen = 0;
		}

		generate() {
			let newgen = '';
			for(let i = 0; i < this.sentence.length; i++) {
				for(let j = 0; j < this.ruleset.length; j++) {
					if(this.sentence.charAt(i) === this.ruleset[j].a)
						newgen += this.ruleset[j].b;
					else
						newgen += this.sentence.charAt(i);
				}
			}
			this.sentence = newgen;
			this.gen++;
		}

		getSentence() {
			return this.sentence;
		}

		getGen() {
			return this.gen;
		}
	}

	class Turtle {
		constructor(sentence, len = 50) {
			this.sentence = sentence;
			this.len = len;
		}

		setSentence(sentence) {
			this.sentence = sentence;
			this.len *= 0.65;
		}

		draw() {
			for(let i = 0; i < this.sentence.length; i++) {
				switch(this.sentence.charAt(i)) {
					case 'F':
						p.line(0, 0, 0, -this.len);
						p.translate(0, -this.len);
						break;
					case '+':
						p.rotate(p.PI / 6);
						break;
					case '-':
						p.rotate(-p.PI / 6);
						break;
					case '[':
						p.push();
						break;
					case ']':
						p.pop();
						break;
				}
			}
		}
	}

	let turtle;
	let lsys;

	p.setup = () => {
		p.createCanvas(600, 600);

		let ruleset = [{
			a: 'F',
			b: 'FF+[+F-F-F]-[-F+F+F]'
		}];
		
		lsys = new LSystem('F', ruleset);

		turtle = new Turtle(lsys.getSentence());
	}

	p.draw = () => {
		p.background(255);

		p.stroke(0, 0);
		p.fill(0);
		p.text("Click to generate", 5, 15);

		p.translate(p.width / 2, p.height);
		p.stroke(0, 100);
		turtle.draw();
	}

	p.mousePressed = () => {
		lsys.generate();
		turtle.setSentence(lsys.getSentence());
	}
}