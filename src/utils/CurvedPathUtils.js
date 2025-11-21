import * as THREE from "three";

export default class CurvedPathUtils {
	constructor({ speed, nbOfPoints, arcSamples, points }) {
		this.speed = speed !== undefined ? speed : 0.125;
		this.nbOfPoints = nbOfPoints !== undefined ? nbOfPoints : 1000;
		this.arcSamples = arcSamples !== undefined ? arcSamples : 5000;

		this.uniformPoints = [];
		this.uniformTangents = [];
		this.index = 0;

		this.curve = new THREE.CatmullRomCurve3(points);
		this.curve.closed = true;

		this.totalCurveLength = this.curve.getLength();

		this.buildUniformPoints();
	}

	getUniformPoint(index) {
		const i = Math.floor(index) % this.uniformPoints.length;
		const next = (i + 1) % this.uniformPoints.length;
		const alpha = index - Math.floor(index);

		return new THREE.Vector3().lerpVectors(this.uniformPoints[i], this.uniformPoints[next], alpha);
	}

	getUniformTangent(index) {
		const i = Math.floor(index) % this.uniformTangents.length;
		const next = (i + 1) % this.uniformTangents.length;
		const alpha = index - Math.floor(index);

		return new THREE.Vector3()
			.lerpVectors(this.uniformTangents[i], this.uniformTangents[next], alpha)
			.normalize();
	}

	getPositionAndTangent(deltaTime) {
		this.index += (this.speed * deltaTime) / this.totalCurveLength * this.nbOfPoints;

		return {
			position: this.getUniformPoint(this.index),
			tangent: this.getUniformTangent(this.index)
		};
	}

	buildUniformPoints() {
		this.uniformPoints.splice(0);
		this.uniformTangents.splice(0);

		// Sample the curve at high resolution
		const highResPoints = [];
		const highResTangents = [];

		for (let i = 0; i <= this.arcSamples; i++) {
			const t = i / this.arcSamples;
			highResPoints.push(this.curve.getPoint(t));
			highResTangents.push(this.curve.getTangent(t).normalize());
		}

		// Compute cumulative distances
		const distances = [0];
		for (let i = 1; i < highResPoints.length; i++) {
			const dist = highResPoints[i - 1].distanceTo(highResPoints[i]);
			distances.push(distances[distances.length - 1] + dist);
		}

		const totalLength = distances[distances.length - 1];

		// Create uniformly spaced points and tangents
		for (let i = 0; i < this.nbOfPoints; i++) {
			const targetDistance = (i / this.nbOfPoints) * totalLength;

			let segmentIndex = 0;
			for (let j = 1; j < distances.length; j++) {
				if (distances[j] >= targetDistance) {
					segmentIndex = j - 1;
					break;
				}
			}

			const t1 = distances[segmentIndex];
			const t2 = distances[segmentIndex + 1];
			const alpha = (targetDistance - t1) / (t2 - t1);

			const point = new THREE.Vector3().lerpVectors(
				highResPoints[segmentIndex],
				highResPoints[segmentIndex + 1],
				alpha
			);

			const tangent = new THREE.Vector3().lerpVectors(
				highResTangents[segmentIndex],
				highResTangents[segmentIndex + 1],
				alpha
			).normalize();

			this.uniformPoints.push(point);
			this.uniformTangents.push(tangent);
		}
	}
}
