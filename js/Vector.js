import nextRand from './Random';

export default class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	static random() {
		return new Vector(0.5 - nextRand(), 0.5 - nextRand()).normalize();
	}

	add(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	}

	scale(s) {
		this.x *= s;
		this.y *= s;
		return this;
	}

	times(s) {
		return new Vector(this.x * s, this.y * s);
	}

	mag() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	normalize(length) {
		const s = this.mag() / (length || 1);
		this.x /= s;
		this.y /= s;
		return this;
	}
}
