import nextRand from './Random';
import Particle from './Particle';

// Canvas variables
const canvas = document.getElementById('canvas');
const context = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

// Initialize particles
let particles = [];
const NUM_PARTICLES = 5000;
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
	context.fillStyle = 'rgba(0, 0, 0, 0.25)';
	context.fillRect(0, 0, width, height);

	// Render each particle
	particles.forEach(p => p.render(context));

	// Choose the border color based on the average of all particle colors
	let color = particles.reduce((acc, p) => {
		acc[0] += p.r;
		acc[1] += p.g;
		acc[2] += p.b;
		return acc;
	}, [0, 0, 0]);
	color = color.map(c => {
		const avg = Math.round(c / particles.length);
		return Math.min(255, Math.max(0, 128 + (avg - 128) * 10));
	});
	context.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
	context.lineWidth = 6;
	context.strokeRect(3, 3, width - 6, height - 6);

	// Render the update time
	context.fillStyle = 'black';
	context.fillRect(0, 0, 88, 44);
	context.fillStyle = 'white';
	context.font = '13px Helvetica';
	context.textBaseline = 'top';
	context.textAlign = 'left';
	context.fillText(`Render ${updateCount}`, 5, 5);
	context.fillText(`${avgUpdateTime.toFixed(2)} ms`, 5, 24);
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

	// Record statistics if needed
	if (updateCount === 100 || updateCount === 500 || updateCount === 1000) {
		const t = Math.round(avgUpdateTime * updateCount);
		const label = document.getElementById(`first-${updateCount}-label`);
		label.textContent = `${updateCount} renders: ${t} ms (${avgUpdateTime.toFixed(1)} ms/render)`;
	}

	requestAnimationFrame(update);
}

requestAnimationFrame(update);
