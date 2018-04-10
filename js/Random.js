const MAX = 2147483646;
let state = 1;

export default function nextRand() {
	const ret = state / MAX;
	state = state * state * 16807 % MAX;
	return ret;
}
