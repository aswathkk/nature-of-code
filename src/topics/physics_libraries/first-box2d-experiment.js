import { scaleToWorld, scaleToPixels } from './box2d-helper';

module.exports = function (p) {

	let world;

	class Shape {
		constructor(x, y) {
			this.w = 20;
			this.h = 20;

			this.x = x;
			this.y = y;

			// body definition
			let bd = new box2d.b2BodyDef();
			bd.type = box2d.b2BodyType.b2_dynamicBody;
			bd.position = scaleToWorld(x, y);

			// fixture definition
			let fd = new box2d.b2FixtureDef();
			fd.shape = new box2d.b2PolygonShape();
			fd.shape.SetAsBox(scaleToWorld(this.w / 2), scaleToWorld(this.h / 2));
			fd.density = 1;
			fd.friction = .3;
			fd.restitution = .1;

			// Create body and attach fixture
			this.body = world.CreateBody(bd);
			this.body.CreateFixture(fd);
		}

		draw() {
			p.fill(255);
			p.stroke(255);

			let pos = scaleToPixels(this.body.GetPosition());
			let angle = this.body.GetAngleRadians();

			p.push();
			p.translate(pos.x, pos.y);
			p.rotate(angle);
			p.rect(0, 0, this.w, this.h);
			p.pop();
		}
	}

	class Wall {
		constructor(x, y, w, h) {
			this.w = w;
			this.h = h;

			this.x = x;
			this.y = y;

			let bd = new box2d.b2BodyDef();
			bd.type = box2d.b2BodyType.b2_staticBody;
			bd.position = scaleToWorld(x, y);

			let fd = new box2d.b2FixtureDef();
			fd.shape = new box2d.b2PolygonShape();
			fd.shape.SetAsBox(scaleToWorld(this.w / 2), scaleToWorld(this.h / 2));
			fd.density = 1;
			fd.friction = 0.6;
			fd.restitution = 0.1;

			this.body = world.CreateBody(bd);
			this.body.CreateFixture(fd);
		}

		draw() {
			p.fill(70);
			p.stroke(70);

			let pos = scaleToPixels(this.body.GetPosition());

			p.push();
			p.translate(pos.x, pos.y);
			p.rect(0, 0, this.w, this.h);
			p.pop();
		}
	}

	let walls = new Array();
	let shapes = new Array();
	let initialCount = 50;

	p.setup = () => {
		p.createCanvas(500, 500);
		p.rectMode(p.CENTER);

		let gravity = new box2d.b2Vec2(0, 9.8);
		
		// creating world
		world = new box2d.b2World(gravity, true);

		walls.push(new Wall(160, 400, 300, 10));
		walls.push(new Wall(p.width - 110, 300, 200, 10));
	}

	p.draw = () => {
		p.background(33, 150, 243);

		world.Step(1 / 30, 10, 10);

		for(let i = 0; i < walls.length; i++)
			walls[i].draw();

		for(let i = 0; i < shapes.length; i++)
			shapes[i].draw();

		if(shapes.length <= initialCount)
			shapes.push(new Shape(p.random(250, 300), 0));
	}

	p.mousePressed = () => {
		shapes.push(new Shape(p.mouseX, p.mouseY));
	}
}