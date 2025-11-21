export default class Time {
	constructor() {
		this._start = performance.now();
		this._current = this._start;
		this._elapsed = 0;
		this._delta = 16;
	}

	// The number of MS elapsed since the timer started
	get elapsedMs() {
		return this._elapsed;
	}

	get elapsedSeconds() {
		return this._elapsed / 1000;
	}

	get deltaMs() {
		return this._delta;
	}

	get deltaSeconds() {
		return this._delta / 1000;
	}

	tick() {
		const currentTime = performance.now();

		this._delta = currentTime - this._current;
		this._current = currentTime;
		this._elapsed = this._current - this._start;
	}
}
