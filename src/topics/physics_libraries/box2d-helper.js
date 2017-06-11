require('script-loader!box2d-html5');

let scaleFactor = 10;

export function scaleToWorld(a, b) {
	if(a instanceof box2d.b2Vec2)
		return new box2d.b2Vec2(a.x / scaleFactor, a.y / scaleFactor);
	else if(typeof b !== 'undefined')
		return new box2d.b2Vec2(a / scaleFactor, b / scaleFactor);
	else
		return a / scaleFactor;
}

export function scaleToPixels(a, b) {
	if(a instanceof box2d.b2Vec2)
		return new box2d.b2Vec2(a.x * scaleFactor, a.y * scaleFactor);
	else if(typeof b !== 'undefined')
		return new box2d.b2Vec2(a * scaleFactor, b * scaleFactor);
	else
		return a * scaleFactor;
}