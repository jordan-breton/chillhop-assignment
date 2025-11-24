import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default function initCameraController(canvas, camera, sizes) {
	let canvasRect = canvas.getBoundingClientRect();

	// const orbit = new OrbitControls(camera, canvas);

	window.addEventListener('resize', () => {
		canvasRect = canvas.getBoundingClientRect();
	});

	const target = { x: 0, y: 0 };

	const maxTiltX = 0.025; // pitch
	const maxTiltY = 0.0125; // yaw

	const baseQuat = camera.quaternion.clone();
	const tiltQuat = new THREE.Quaternion();
	const finalQuat = new THREE.Quaternion();

	canvas.addEventListener('pointerdown', (e) => e.preventDefault());
	canvas.addEventListener('pointermove', (e) => {
		const x = e.clientX - canvasRect.left;
		const y = e.clientY - canvasRect.top;

		const nx = (x / canvasRect.width) * 2 - 1;
		const ny = (y / canvasRect.height) * 2 - 1;

		let yaw   = -nx * maxTiltY;
		let pitch = -ny * maxTiltX;

		// clamp upward tilt
		pitch = Math.min(pitch, 0);

		// clamp left/right tilt
		const yawMin = -0.03;
		const yawMax =  0.03;
		yaw = Math.max(yawMin, Math.min(yaw, yawMax));

		target.x = pitch;
		target.y = yaw;
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