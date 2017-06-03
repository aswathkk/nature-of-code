import p5 from 'p5/lib/p5.min.js';
import './scss/style.scss';

import randomWalkTowardsMouse from './topics/introduction/1.js';

const chapters = [{
	name: 'Introduction',
	samples: [{
		name: 'Random Walk Towards Mouse',
		demo: randomWalkTowardsMouse
	}]
}];

new p5(chapters[0].samples[0].demo, 'disp');