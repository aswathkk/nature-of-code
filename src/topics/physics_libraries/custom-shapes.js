import { scaleToWorld, scaleToPixels } from './box2d-helper';

module.exports = function (p) {

	let world;

	class CustomPolygon {
		constructor(x, y) {
			this.w = 20;
			this.h = 20;

			this.vertices = [];
			this.vertices.push(scaleToWorld(15, -15));
			this.vertices.push(scaleToWorld(10, 5));
			this.vertices.push(scaleToWorld(-15, 15));
			this.vertices.push(scaleToWorld(-10, -5));

			// body definition
			let bd = new box2d.b2BodyDef();
			bd.type = box2d.b2BodyType.b2_dynamicBody;
			bd.position = scaleToWorld(x, y);

			// fixture definition
			let fd = new box2d.b2FixtureDef();
			fd.shape = new box2d.b2PolygonShape();
			
			fd.shape.SetAsArray(this.vertices, this.vertices.length);
			
			fd.density = 1;
			fd.friction = .3;
			fd.restitution = .1;

			// Create body and attach fixture
			this.body = world.CreateBody(bd);
			this.body.CreateFixture(fd);
		}

		draw() {
			p.fill(255,193,7);
			p.stroke(255,193,7);

			let pos = scaleToPixels(this.body.GetPosition());
			let angle = this.body.GetAngleRadians();

			p.push();
			p.translate(pos.x, pos.y);
			p.rotate(angle);
			p.beginShape();
			for(let i = this.vertices.length - 1; i >= 0; i--) {
				let v = scaleToPixels(this.vertices[i]);
				p.vertex(v.x, v.y);
			}
			p.endShape();
			p.pop();
		}
	}

	class CombinedShape {
		constructor(x, y) {
			this.w = 20;
			this.h = 20;

			this.vertices = [];
			this.vertices.push(scaleToWorld(15, 0));
			this.vertices.push(scaleToWorld(0, 25));
			this.vertices.push(scaleToWorld(-15, 0));

			// body definition
			let bd = new box2d.b2BodyDef();
			bd.type = box2d.b2BodyType.b2_dynamicBody;
			bd.position = scaleToWorld(x, y);

			// fixture definition for triangle
			let fd = new box2d.b2FixtureDef();
			fd.shape = new box2d.b2PolygonShape();
			fd.shape.SetAsArray(this.vertices, this.vertices.length);
			fd.density = 1;
			fd.friction = .3;
			fd.restitution = .1;

			//fixture definition for circle
			let fd2 = new box2d.b2FixtureDef();
			fd2.shape = new box2d.b2CircleShape();
			fd2.shape.m_radius = scaleToWorld(10);
			fd2.shape.m_p = scaleToWorld(0, -10);
			fd2.density = 1;
			fd2.friction = .3;
			fd2.restitution = .1;

			// Create body and attach fixture
			this.body = world.CreateBody(bd);
			this.body.CreateFixture(fd);
			this.body.CreateFixture(fd2);
		}

		draw() {
			p.fill(233,30,99);
			p.stroke(233,30,99);

			let pos = scaleToPixels(this.body.GetPosition());
			let angle = this.body.GetAngleRadians();

			p.push();
			p.translate(pos.x, pos.y);
			p.rotate(angle);

			// draw triangle
			p.beginShape();
			for(let i = this.vertices.length - 1; i >= 0; i--) {
				let v = scaleToPixels(this.vertices[i]);
				p.vertex(v.x, v.y);
			}
			p.endShape();

			
			p.fill(233,30,99);
			p.stroke(233,30,99);
			// draw circle
			p.ellipse(0, -10, 20);
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
		p.background(255);

		world.Step(1 / 30, 10, 10);

		for(let i = 0; i < walls.length; i++)
			walls[i].draw();

		for(let i = 0; i < shapes.length; i++)
			shapes[i].draw();

		p.fill(0);
		p.stroke(255);
		p.text("Click to add shapes", 200, 15)
	}

	p.mousePressed = () => {
		if(p.mouseX > p.width / 2)
			shapes.push(new CustomPolygon(p.mouseX, p.mouseY));
		else
			shapes.push(new CombinedShape(p.mouseX, p.mouseY));
	}
}