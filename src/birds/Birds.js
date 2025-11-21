import * as THREE from 'three';
import Bird from "./Bird.js";

export default class Birds {
	/**
	 * Creates a Box3 with the given width, height, depth, positioned at a given origin.
	 * The origin is the center of the bottom face.
	 * @param {number} width
	 * @param {number} height
	 * @param {number} depth
	 * @param {THREE.Vector3} position - The desired origin position (bottom-center)
	 * @returns {THREE.Box3}
	 */
	static createBoundingBox(width, height, depth, position) {
		const halfWidth = width / 2;
		const halfDepth = depth / 2;

		// Local min/max before positioning
		const min = new THREE.Vector3(-halfWidth, 0, -halfDepth);
		const max = new THREE.Vector3(halfWidth, height, halfDepth);

		// Create box
		const box = new THREE.Box3(min, max);

		// Compute translation vector to move origin to target position
		const translation = new THREE.Vector3().copy(position);

		box.min.add(translation);
		box.max.add(translation);

		return box;
	}

	constructor({ birdCount = 10, texture, scene }) {
		this.birds = [];

		this.init({ birdCount, texture, scene });
	}

	init({ birdCount, texture, scene }) {
		const geometry = new THREE.PlaneGeometry(0.04, 0.04, 10, 10);

		const boundingBox = Birds.createBoundingBox(
			15,
			1.5,
			15,
			new THREE.Vector3(
				2, 2.8, 0
			)
		);
		for (let i = 0; i < birdCount; i++) {
			this.birds.push(new Bird({
				geometry,
				texture,
				scene,
				boundingBox,
			}))
		}
	}

	update(time) {
		this.birds.forEach((bird) => bird.update(time));
	}
}
