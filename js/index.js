import nextRand from './Random';
import Particle from './Particle';

// Setup canvas and resize it
const canvas = document.getElementById('canvas');
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = 0.8 * window.innerHeight;
const width = canvas.width;
const height = canvas.height;

// Initialize particles
let particles = [];
const NUM_PARTICLES = 5000;
for (let i = 0; i < NUM_PARTICLES; i++) {
	addParticle();
}

// Misc variables
const liveUpdateLabel = document.getElementById('live-update-label');
const statsRenderLabel = document.getElementById('stats-render');
const statsAvgTimeLabel = document.getElementById('stats-avg-time');
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

	// Record statistics
	statsRenderLabel.textContent = `Render #${updateCount}`;
	if (updateCount % 10 === 0) {
		statsAvgTimeLabel.textContent = `${avgUpdateTime.toFixed(2)} ms/render`;
	}
	if (updateCount === 20 || updateCount === 50 || updateCount === 100 || updateCount % 200 === 0) {
		const t = Math.round(avgUpdateTime * updateCount);
		if (updateCount < 1000) {
			liveUpdateLabel.textContent = `First ${updateCount} renders: ${t} ms (${avgUpdateTime.toFixed(1)} ms/render)`;
		} else {
			liveUpdateLabel.textContent = `First ${updateCount} renders: ${(t/1000).toFixed(2)} s (${avgUpdateTime.toFixed(1)} ms/render)`;
		}
	}

	updateCount++;

	requestAnimationFrame(update);
}

requestAnimationFrame(update);
