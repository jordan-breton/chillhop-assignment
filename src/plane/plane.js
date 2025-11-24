import * as THREE from "three";
import pathPoints from "./planepath.json";

export default function initPlane(scene, model) {
	const plane = model.scene.getObjectByName("plane");
	const propeler = model.scene.getObjectByName("propeler");

	const points = pathPoints.map(p => new THREE.Vector3(p[0], p[2], -p[1]));
	const curve = new THREE.CatmullRomCurve3(points, false);

	const duration = 50;
	let currentBankAngle = 0;

	return {
		update(time) {
			propeler.rotation.z += 0.9;
			const tGlobal = (time.elapsedSeconds % duration) / duration;
			const t = tGlobal % 1;

			const pos = curve.getPoint(t);
			plane.position.copy(pos);

			const tangent = curve.getTangent(t).normalize();

			// Get position slightly ahead to calculate turn
			const tAhead = Math.min(1, t + 0.01);
			const posAhead = curve.getPoint(tAhead);

			const toNext = new THREE.Vector3().subVectors(posAhead, pos).normalize();

			// Calculate turn by taking cross product of current direction and next direction
			const cross = new THREE.Vector3().crossVectors(tangent, toNext);

			// Y component indicates left/right turn
			const targetBankAngle = -cross.y * 10; // Reduced multiplier

			// Smoothly interpolate towards target bank angle
			const smoothFactor = 0.05;
			currentBankAngle += (targetBankAngle - currentBankAngle) * smoothFactor;

			// Create target point for lookAt
			const target = new THREE.Vector3().addVectors(pos, tangent);

			// Apply lookAt
			plane.lookAt(target);

			// Apply smoothed roll (banking)
			plane.rotateZ(THREE.MathUtils.clamp(currentBankAngle, -Math.PI / 4, Math.PI / 4)); // Reduced max bank to 45°
		}
	};
}