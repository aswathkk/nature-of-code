import page from 'page';
import p5 from 'p5/lib/p5.min.js';
import chapters from './chapters';

const _chapter = document.getElementById('chapter');
const _title = document.getElementById('title');
const _disp = document.getElementById('disp');

let canvas;

function reset() {
	if(typeof canvas !== 'undefined')
		canvas.remove();
	_chapter.innerHTML = '&nbsp';
	_title.innerHTML = '';
}

page('/', () => {
	reset();
	let s = '<ol>';
	chapters.forEach((c, i) => {
		s += `<li>${c.name}`;
		if(c.samples) {
			s += '<ul>';
			c.samples.forEach(t => {
				s += `<li><a href="${i}/${t.slug}">${t.name}</a></li>`;
			});
			s += '</ul>';
		}
		s += '</li>';
	});
	_disp.innerHTML = `${s}</ol>`;
});

page('/:chapter/:demo', ctx => {
	_disp.innerHTML = '';
	if(typeof canvas !== 'undefined')
		canvas.remove();
	let chapter = chapters[ctx.params.chapter].samples.filter( chap => chap.slug === ctx.params.demo );
	_chapter.innerHTML = chapters[ctx.params.chapter].name;
	_title.innerHTML = chapter[0].name;
	canvas = new p5(chapter[0].demo, 'disp');
});

page();