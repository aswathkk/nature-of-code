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
		},{
			name: 'Random Walk using Perlin Noise',
			slug: 'random-walk-perlin-noise',
			demo: require('./topics/introduction/random-walk-perlin-noise.js')
		},{
			name: 'Generating cloud using Perlin Noise',
			slug: 'clouds-using-perlin-noise',
			demo: require('./topics/introduction/clouds-using-perlin-noise.js')
		}]
	},

	{
		name: 'Vectors',
		samples: [{
			name: 'Bouncing Ball',
			slug: 'bouncing-ball',
			demo: require('./topics/vectors/bouncing-ball.js')
		},{
			name: 'Ball with random acceleration',
			slug: 'ball-with-acceleration',
			demo: require('./topics/vectors/ball-with-acceleration.js')
		},{
			name: 'Ball with random acceleration experiencing Gravity',
			slug: 'ball-with-acceleration-and-gravity',
			demo: require('./topics/vectors/ball-with-acceleration-and-gravity.js')
		}]
	},

	{
		name: 'Forces',
		samples: [{
			name: 'Helium balloons',
			slug: 'helium-balloons',
			demo: require('./topics/forces/helium-balloons.js')
		},{
			name: 'Playing with mass',
			slug: 'playing-with-mass',
			demo: require('./topics/forces/playing-with-mass.js')
		},{
			name: 'Playing with Friction',
			slug: 'playing-with-friction',
			demo: require('./topics/forces/playing-with-friction.js')
		},{
			name: 'Fluid Resistance: Experiment with drag force',
			slug: 'fluid-resistance',
			demo: require('./topics/forces/fluid-resistance.js')
		},{
			name: 'Gravitational Attraction',
			slug: 'gravitational-attraction',
			demo: require('./topics/forces/gravitational-attraction.js')
		},{
			name: 'Satellite launch',
			slug: 'satellite-launch',
			demo: require('./topics/forces/satellite-launch.js')
		}]
	},

	{
		name: 'Oscillation',
		samples: [{
			name: 'Cannon',
			slug: 'cannon',
			demo: require('./topics/oscillation/cannon.js')
		},{
			name: 'Pointing in the direction of Motion',
			slug: 'pointing-in-the-direction-of-motion',
			demo: require('./topics/oscillation/pointing-in-the-direction-of-motion.js')
		},{
			name: 'Pendulum',
			slug: 'pendulum',
			demo: require('./topics/oscillation/pendulum.js')
		}]
	}//,

	// {
	// 	name: 'Particle Systems'
	// },

	// {
	// 	name: 'Physics Libraries'
	// },

	// {
	// 	name: 'Autonomous Agents'
	// },

	// {
	// 	name: 'Cellular Automata'
	// },

	// {
	// 	name: 'Fractals'
	// },

	// {
	// 	name: 'The Evolution of Code'
	// },

	// {
	// 	name: 'Neural Networks'
	// }
];

export default chapters;