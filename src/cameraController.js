import * as THREE from 'three';

export default function initCameraController(canvas, camera, sizes) {
	let canvasRect = canvas.getBoundingClientRect();

	window.addEventListener('resize', () => {
		canvasRect = canvas.getBoundingClientRect();
	});

	const target = { x: 0, y: 0 };

	const maxTiltX = 0.05; // pitch
	const maxTiltY = 0.05; // yaw

	const baseQuat = camera.quaternion.clone();
	const tiltQuat = new THREE.Quaternion();
	const finalQuat = new THREE.Quaternion();

	canvas.addEventListener('pointerdown', (e) => e.preventDefault());
	canvas.addEventListener('pointermove', (e) => {
		const nx = (((canvasRect.left - e.clientX) / sizes.width) * 2 - 1) * 0.35;
		const ny = (((canvasRect.top - e.clientY) / sizes.height) * 2 - 2) * 0.35;

		target.y = nx * maxTiltY;
		target.x = ny * maxTiltX;
	}, { passive: false });

	window.addEventListener('resize', () => {
		camera.aspect = sizes.width / sizes.height;
		camera.updateProjectionMatrix();
	});

	return {
		update() {
			tiltQuat.setFromEuler(
				new THREE.Euler(target.x, target.y, 0, 'YXZ'),
			);
			finalQuat.copy(baseQuat).multiply(tiltQuat);
			camera.quaternion.slerp(finalQuat, 0.12);
		}
	}
}