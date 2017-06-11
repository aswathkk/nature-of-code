import { scaleToWorld, scaleToPixels } from './box2d-helper';

module.exports = function (p) {

	let world;

	class Shape {
		constructor(x, y, s = 10) {
			this.w = s;
			this.h = s

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

		kill() {
			world.DestroyBody(this);
		}

		done() {
			let pos = scaleToPixels(this.body.GetTransform().p);
			if(pos.x > p.width || pos.x < 0 || pos.y > p.height) {
				this.kill();
				return true;
			}
			return false;
		}
	}

	class Wall {
		constructor() {
			this.outline = new Array();

			this.outline.push(scaleToWorld(new box2d.b2Vec2(0, p.height)));
			this.outline.push(scaleToWorld(new box2d.b2Vec2(0, p.height - 100)));
			for(let x = 0; x < p.PI; x+=.5) {
				let y = p.noise(x) * 400;
				this.outline.push(scaleToWorld(new box2d.b2Vec2(x * 100, y + 250)));
			}
			this.outline.push(scaleToWorld(new box2d.b2Vec2(p.width, p.height - 100)));
			this.outline.push(scaleToWorld(new box2d.b2Vec2(p.width, p.height)));

			let chain = new box2d.b2ChainShape();
			chain.CreateChain(this.outline, this.outline.length);

			let bd = new box2d.b2BodyDef();
			this.body = world.CreateBody(bd);

			let fd = new box2d.b2FixtureDef();
			fd.shape = chain;
			fd.density = 1;
			fd.friction = 1;
			fd.restitution = .1;

			this.body.CreateFixture(fd);
		}

		draw() {
			p.fill(70, 200);
			p.stroke(70);

			p.beginShape();
			for(let i = 0; i < this.outline.length; i++) {
				let v = scaleToPixels(this.outline[i]);
				p.vertex(v.x, v.y);
			}
			p.endShape();
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

		walls.push(new Wall(20, 250));
	}

	p.draw = () => {
		p.background(33, 150, 243);

		world.Step(1 / 30, 10, 10);

		for(let i = 0; i < walls.length; i++)
			walls[i].draw();

		for(let i = shapes.length - 1; i >= 0; i--) {
			shapes[i].draw();
			if(shapes[i].done())
				shapes.splice(i, 1);
		}

		if(shapes.length <= initialCount)
			shapes.push(new Shape(300, 0, p.random(10, 30)));
	}

	p.mousePressed = () => {
		shapes.push(new Shape(p.mouseX, p.mouseY, p.random(10, 30)));
	}
}