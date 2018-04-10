import nextRand from './Random';
import Particle from './Particle';

// Canvas variables
const canvas = document.getElementById('canvas');
const context = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

// Initialize particles
let particles = [];
const NUM_PARTICLES = 1000;
for (let i = 0; i < NUM_PARTICLES; i++) {
	addParticle();
}

// Misc variables
let lastUpdateTime;
let updateCount = 0;
let avgUpdateTime = 0;

// Creates a new particle at a random location
function addParticle() {
	const p = new Particle(width * nextRand(), height * nextRand());
	particles.push(p);
}

// Renders the particles
function render() {
	context.fillStyle = 'black';
	context.fillRect(0, 0, width, height);

	// Render each particle
	particles.forEach(p => p.render(context));

	// Render the update time
	context.fillStyle = 'black';
	context.fillRect(0, 0, 70, 25);
	context.fillStyle = 'white';
	context.font = '13px Helvetica';
	context.textBaseline = 'top';
	context.textAlign = 'left';
	context.fillText(`${avgUpdateTime.toFixed(2)} ms`, 5, 5);
}

// Updates the simulation state
function update() {
	const start = performance.now();

	if (!lastUpdateTime) {
		lastUpdateTime = start;
	}
	const dt = (start - lastUpdateTime) / 1000;
	lastUpdateTime = start;

	// Update each particle
	particles.forEach(p => p.update(dt, width, height));

	// Filter out expired particles
	particles = particles.filter(p => p.ttl > 0);

	// Create new particles to replace expired ones
	while (particles.length < NUM_PARTICLES) {
		addParticle();
	}

	render();

	const updateTime = performance.now() - start;
	avgUpdateTime = (avgUpdateTime * updateCount + updateTime) / (updateCount + 1);

	updateCount++;

	requestAnimationFrame(update);
}

update();