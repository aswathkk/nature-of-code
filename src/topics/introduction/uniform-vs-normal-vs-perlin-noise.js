module.exports = function (p) {
	let x = 0, t = 0;

	p.setup = () => {
		p.createCanvas(600, 600);
	}

	p.draw = () => {
		x += .1;

		// Uniform distribution
		let y = 30 + p.random(0, 50);
		p.point(x, y);

		// Gaussian distribution
		let mean = 200;
		let sd = 20;
		let y1 = sd * p.randomGaussian() + mean;
		p.point(x, y1);

		// Perlin noise
		t += .01;
		let y2 = p.noise(t);
		y2 = 330 + p.map(y2, 0, 1, 0, 100);
		p.point(x, y2)
	}
}