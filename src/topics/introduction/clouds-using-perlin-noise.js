module.exports = function (p) {

	p.setup = () => {
		p.createCanvas(600, 600);

		p.pixelDensity(1);
		p.loadPixels();
		let xt = 0, yt = 0;
		for(let x = 0; x < p.width; x++) {
			xt = 0;
			for(let y = 0; y < p.height; y++) {
				let i = (x + y * p.width) * 4; // index of 'pixels' array for (x, y)
				
				let c = p.noise(xt, yt) * 255; // 2d perlin noise
				
				p.pixels[i] = c; // red for pixel (x, y)
				p.pixels[i + 1] = c; // green for pixel (x, y)
				p.pixels[i + 2] = c; // blue for pixel (x, y)
				p.pixels[i + 3] = 255; // alpha for pixel (x, y)
			
				xt += .01;
			}
				yt += .01;
		}
		p.updatePixels();
	}

	p.draw = () => {
		
	}
}
