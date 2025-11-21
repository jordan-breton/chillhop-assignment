import * as THREE from "three";

export default class Random {
	static sign() {
		return Math.random() > 0.5 ? 1 : -1;
	}

	static between(min, max) {
		return Math.random() * (max - min) + min;
	}

	static betweenInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	static color() {
		return new THREE.Color(Math.random(), Math.random(), Math.random());
	}

	static colorBetween(color1, color2, variation = 1) {
		return color1.clone().lerp(color2, Math.random() * variation);
	}

	/**
	 * Picks a random point within the boundaries of a Three.js Box3
	 */
	static pointInBox(box3) {
		if (box3.isEmpty()) {
			throw new Error('Cannot pick random point from empty Box3');
		}

		const min = box3.min;
		const max = box3.max;

		const x = Math.random() * (max.x - min.x) + min.x;
		const y = Math.random() * (max.y - min.y) + min.y;
		const z = Math.random() * (max.z - min.z) + min.z;

		return new THREE.Vector3(x, y, z);
	}

	static makeRandomSineCurve({
		octaves = 4,
		amplitude = 1,
		frequency = 1,
		seed = Math.random() * 1e9
	} = {}) {
		function rand() {
			seed = (seed * 1664525 + 1013904223) % 4294967296;
			return seed / 4294967296;
		}

		const layers = [];
		for (let i = 0; i < octaves; i++) {
			layers.push({
				amp: amplitude * (0.5 ** i),
				freq: frequency * (2 ** i),
				phase: rand() * Math.PI * 2
			});
		}

		return x => {
			let y = 0;
			for (const l of layers) {
				y += Math.sin(x * l.freq + l.phase) * l.amp;
			}
			return y;
		};
	}
}
