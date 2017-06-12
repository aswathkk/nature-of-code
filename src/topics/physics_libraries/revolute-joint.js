import { scaleToWorld, scaleToPixels } from './box2d-helper';

module.exports = function (p) {

	let world;

	class Box {
		constructor(x, y, w, h) {
			this.w = w;
			this.h = h;

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
			p.stroke(0);

			let pos = scaleToPixels(this.body.GetPosition());
			let angle = this.body.GetAngleRadians();

			p.push();
			p.translate(pos.x, pos.y);
			p.rotate(angle);
			p.rect(0, 0, this.w, this.h);
			p.pop();
		}
	}

	class Circle {
		constructor(x, y, r) {
			this.x = x;
			this.y = y;
			this.r = r;

			let bd = new box2d.b2BodyDef();
			bd.type = box2d.b2BodyType.b2_dynamicBody;
			bd.position = scaleToWorld(x, y);

			this.body = world.CreateBody(bd);

			let fd = new box2d.b2FixtureDef();
			fd.shape = new box2d.b2CircleShape();
			fd.shape.m_radius = scaleToWorld(this.r);
			fd.density = 1;
			fd.friction = .3;
			fd.restitution = .1;

			this.body.CreateFixture(fd);
		}

		draw() {
			p.fill(255);
			p.stroke(0);

			let pos = scaleToPixels(this.body.GetPosition())
			let angle = this.body.GetAngleRadians();
			
			p.push();
			p.translate(pos.x, pos.y);
			p.rotate(angle);
			p.ellipse(0, 0, this.r * 2);
			p.line(0, 0, this.r, 0)
			p.pop();
		}
	}

	class Vehicle {
		constructor(x, y) {
			this.wheel1 = new Circle(x + 13, y + 13, 5);
			this.wheel2 = new Circle(x - 13, y + 13, 5);
			this.chasis = new Box(x, y, 50, 25);

			let rjd1 = new box2d.b2RevoluteJointDef();
			rjd1.Initialize(this.chasis.body, this.wheel1.body, this.wheel1.body.GetWorldCenter());
			rjd1.enableMotor = false;
			this.joint1 = world.CreateJoint(rjd1);

			let rjd2 = new box2d.b2RevoluteJointDef();
			rjd2.Initialize(this.chasis.body, this.wheel2.body, this.wheel2.body.GetWorldCenter());
			rjd2.enableMotor = false;
			this.joint2 = world.CreateJoint(rjd2);
		}

		draw() {
			p.push();
			this.chasis.draw();
			this.wheel1.draw();
			this.wheel2.draw();
			p.pop();
		}
	}

	class Wall {
		constructor() {
			this.outline = new Array();

			this.outline.push(scaleToWorld(new box2d.b2Vec2(0, p.height)));
			this.outline.push(scaleToWorld(new box2d.b2Vec2(0, p.height - 100)));

			this.outline.push(scaleToWorld(new box2d.b2Vec2(100, 350)));
			
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
	}

	p.mousePressed = () => {
		shapes.push(new Vehicle(p.mouseX, p.mouseY));
	}
}