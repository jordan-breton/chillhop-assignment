import * as THREE from 'three';

export default function initLights(scene, model) {
	let directionalLight = new THREE.DirectionalLight('#0021ad', 0.8);
	directionalLight.position.set(-8, 10, 8);
	/*directionalLight.castShadow = true;
	directionalLight.shadow.mapSize.set(1024, 1024);
	directionalLight.shadow.camera.near = 0.0;
	directionalLight.shadow.camera.far = 100;
	directionalLight.shadow.camera.top = 8;
	directionalLight.shadow.camera.right = 8;
	directionalLight.shadow.camera.bottom = -8;
	directionalLight.shadow.camera.left = -8;*/
	scene.add(directionalLight);

	directionalLight = new THREE.DirectionalLight('#0137c1', 2);
	directionalLight.position.set(-6, 0.2, -3);
	directionalLight.target.position.set(0, 3, 0);
	scene.add(directionalLight);

	model.scene.getObjectByName('lights').traverse((pointLight) => {
		pointLight.intensity = 0.5;
		pointLight.color = new THREE.Color("#ff9900");
		pointLight.decay = 5;
		pointLight.castShadow = false;
	});
}