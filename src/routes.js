import page from 'page';
import p5 from 'p5/lib/p5.min.js';
import chapters from './chapters';

const _chapter = document.getElementById('chapter');
const _title = document.getElementById('title');
const _disp = document.getElementById('disp');

let canvas;

// page.base('/nature-of-code');

page('/', (ctx) => {
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
	if(canvas !== undefined)
		canvas.remove();

	let chapter = chapters[ctx.params.chapter];
	if(chapter.samples === undefined)
		return page.redirect('/');

	let experiment = chapter.samples.filter( chap => chap.slug === ctx.params.demo )[0];
	if(experiment === undefined)
		return page.redirect('/');

	_chapter.innerHTML = chapter.name;
	_title.innerHTML = experiment.name;

	canvas = new p5(experiment.demo, 'disp');
});

page('*', (ctx) => {
	page.redirect('/');
})

page({ hashbang: true });

function reset() {
	if(canvas !== undefined)
		canvas.remove();
	_chapter.innerHTML = '&nbsp';
	_title.innerHTML = '';
}
