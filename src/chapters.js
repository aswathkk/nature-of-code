const chapters = [
	{
		name: 'Introduction',
		samples: [{
			name: 'Random Walk Towards Mouse Pointer',
			slug: 'random-walk-towards-mouse-pointer',
			demo: require('./topics/introduction/random-walk-towards-mouse-pointer.js')
		},{
			name: 'Uniform distribution / Gaussian distribution / Perlin noise',
			slug: 'uniform-vs-normal-vs-perlin-noise',
			demo: require('./topics/introduction/uniform-vs-normal-vs-perlin-noise.js')
		}]
	},

	{
		name: 'Vectors'
	},

	{
		name: 'Forces'
	},

	{
		name: 'Oscillation'
	},

	{
		name: 'Particle Systems'
	},

	{
		name: 'Physics Libraries'
	},

	{
		name: 'Autonomous Agents'
	},

	{
		name: 'Cellular Automata'
	},

	{
		name: 'Fractals'
	},

	{
		name: 'The Evolution of Code'
	},

	{
		name: 'Neural Networks'
	}
];

export default chapters;