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
			fd.shape = new box2d.b2CircleShape();
			fd.shape.m_radius = scaleToWorld(10);
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
			p.ellipse(0, 0, 20);
			p.line(0, 0, 10, 0);
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

	class Bridge {
		constructor(x1, y1, x2, y2) {
			
			this.len = 1;

			this.wall1 = new Wall(x1, y1, 10, 10);
			this.wall2 = new Wall(x2, y2, 10, 10);

			this.points = [];

			let n = (x2 - x1) / 20;
			for(let i = 0; i <= n; i++) {
				if(i !== n)
					this.points.push(new Shape(x1 + this.len, y1));

				let djd = new box2d.b2DistanceJointDef();

				if(i == 0) {
					// joint between wall 1 & first point.
					djd.bodyA = this.wall1.body;
					djd.bodyB = this.points[i].body;
				} else if(i == n) {
					// joint between first point and wall.
					djd.bodyA = this.points[i - 1].body;
					djd.bodyB = this.wall2.body;
				} else {
					// joint between point and previous point.
					djd.bodyA = this.points[i - 1].body;
					djd.bodyB = this.points[i].body;
				}

				djd.length = scaleToWorld(this.len);
				djd.frequencyHz = 3;
				djd.dampingRatio = .4;
				world.CreateJoint(djd);
			}
		}

		draw() {
			this.wall1.draw();
			this.wall2.draw();

			for(let i = 0; i < this.points.length; i++)
				this.points[i].draw();
		}
	}

	let shapes = new Array();
	let bridge;

	p.setup = () => {
		p.createCanvas(500, 500);
		p.rectMode(p.CENTER);

		let gravity = new box2d.b2Vec2(0, 9.8);
		
		// creating world
		world = new box2d.b2World(gravity, true);

		bridge = new Bridge(20, p.height / 2, p.width - 20, p.height / 2);
	}

	p.draw = () => {
		p.background(33, 150, 243);

		world.Step(1 / 30, 10, 10);

		bridge.draw();

		for(let i = 0; i < shapes.length; i++)
			shapes[i].draw();

	}

	p.mousePressed = () => {
		shapes.push(new Shape(p.mouseX, p.mouseY));
	}
}