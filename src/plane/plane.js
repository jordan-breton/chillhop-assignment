import * as THREE from "three";
import pathPoints from "./planepath.json";

export default function initPlane(config, scene, model) {
	const plane = model.scene.getObjectByName("plane");
	const propeller = model.scene.getObjectByName("propeler");

	let emissiveMaterials = [];

	plane.traverse((planePart) => {
		if (planePart instanceof THREE.Mesh) {
			planePart.castShadow = true;
			planePart.receiveShadow = true;
		}

		if (planePart.material && !planePart.material?.name?.match('light')) {
			planePart.material = new THREE.MeshToonMaterial({
				color: planePart.material.color,
				map: planePart.material.map,
			});
		}

		if (planePart.material?.name?.match('light')) {
			planePart.material.emissive = planePart.material.color;
			planePart.material.emissiveIntensity = 2;
			emissiveMaterials.push(planePart.material);
		}
	});

	config.on(
		'changed',
		({detail: {
			'lights.plane.intensity': intensity,
		}}) => {
			emissiveMaterials.forEach((material) => {
				material.emissiveIntensity = intensity;
			});
		}
	);

	const points = pathPoints.map(p => new THREE.Vector3(p[0], p[2], -p[1]));
	const curve = new THREE.CatmullRomCurve3(points, false);

	const duration = 50;
	let currentBankAngle = 0;

	return {
		update(time) {
			propeller.rotation.z += 0.9;

			const tGlobal = (time.elapsedSeconds % duration) / duration;
			const t = tGlobal % 1;

			const pos = curve.getPoint(t);
			plane.position.copy(pos);

			const tangent = curve.getTangent(t).normalize();

			const tAhead = Math.min(1, t + 0.01);
			const posAhead = curve.getPoint(tAhead);

			const toNext = new THREE.Vector3().subVectors(posAhead, pos).normalize();

			const cross = new THREE.Vector3().crossVectors(tangent, toNext);

			const targetBankAngle = -cross.y * 10;

			const smoothFactor = 0.01;
			currentBankAngle += (targetBankAngle - currentBankAngle) * smoothFactor;

			const target = new THREE.Vector3().addVectors(pos, tangent);
			plane.lookAt(target);

			plane.rotateZ(THREE.MathUtils.clamp(currentBankAngle, -Math.PI / 4, Math.PI / 4));
		}
	};
}