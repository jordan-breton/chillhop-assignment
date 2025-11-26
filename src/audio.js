import * as THREE from 'three';

const audioCache = new Map();

export default function initAudio(config) {
	let listener;
	let currentAudioUrl = null;
	let currentAudio = null;
	let isFirstChange = true;
	const CROSSFADE_DURATION = 0.5; // seconds

	function getListener() {
		if (!listener) {
			listener = new THREE.AudioListener();
		}
		return listener;
	}

	async function getAudioBuffer(url) {
		if (audioCache.has(url)) return audioCache.get(url);
		const loader = new THREE.AudioLoader();
		const buffer = await new Promise((resolve, reject) => {
			loader.load(url, resolve, undefined, reject);
		});
		audioCache.set(url, buffer);
		return buffer;
	}

	function crossfade(fromAudio, toAudio, duration) {
		const startTime = performance.now();
		const fromStartVol = fromAudio ? fromAudio.getVolume() : 0;
		const toStartVol = toAudio.getVolume();
		const toTargetVol = 1.0;

		function tick() {
			const now = performance.now();
			const t = Math.min((now - startTime) / (duration * 1000), 1);

			if (fromAudio) {
				fromAudio.setVolume(fromStartVol * (1 - t));
			}
			toAudio.setVolume(toStartVol + (toTargetVol - toStartVol) * t);

			if (t < 1) {
				requestAnimationFrame(tick);
			} else {
				if (fromAudio) {
					fromAudio.stop();
				}
			}
		}

		requestAnimationFrame(tick);
	}

	async function playAudio(url) {
		const buffer = await getAudioBuffer(url);

		const newAudio = new THREE.Audio(getListener());
		newAudio.setBuffer(buffer);
		newAudio.setLoop(true);

		if (!currentAudio || isFirstChange) {
			// First time: just fade in from zero, nothing to crossfade with
			newAudio.setVolume(0);
			newAudio.play();
			crossfade(null, newAudio, CROSSFADE_DURATION);
			isFirstChange = false;
		} else {
			// Crossfade from currentAudio to newAudio
			newAudio.setVolume(0);
			newAudio.play();
			crossfade(currentAudio, newAudio, CROSSFADE_DURATION);
		}

		currentAudio = newAudio;
	}

	config.on('changed', async ({ detail: { music } }) => {
		if (!music) return;

		currentAudioUrl = music;
		await playAudio(music);
	});

	return {
		start() {
			return playAudio(currentAudioUrl);
		}
	}
}
