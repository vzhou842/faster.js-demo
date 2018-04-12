import nextRand from './Random';
import Vector from './Vector';

export default class Particle {
	constructor(x, y) {
		this.pos = new Vector(x, y);
		this.vel = Vector.random().times(25 + nextRand() * 25);
		this.radius = 1 + 2 * nextRand();
		this.r = Math.round(255 * nextRand());
		this.g = Math.round(255 * nextRand());
		this.b = Math.round(255 * nextRand());
		this.ttl = 3 * nextRand();
	}

	render(context) {
		context.fillStyle = `rgb(${this.r}, ${this.g}, ${this.b})`;
		context.beginPath();
		context.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
		context.fill();
	}

	update(dt, width, height) {
		// Update position, TTL
		this.pos.add(this.vel.times(dt));
		this.ttl -= dt;

		// Check for collisions against the canvas edge
		const r = this.radius;
		if (this.pos.x < r || this.pos.x > width - r) {
			this.pos.x = Math.min(Math.max(this.pos.x, r), width - r);
			this.vel.x *= -1;
		}
		if (this.pos.y < r || this.pos.y > height - r) {
			this.pos.y = Math.min(Math.max(this.pos.y, r), height - r);
			this.vel.y *= -1;
		}
	}
}