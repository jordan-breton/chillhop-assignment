import * as THREE from 'three';

export default function initLights(scene, model) {
	let directionalLight = new THREE.DirectionalLight(
		'#213E50',
		2,
	);
	directionalLight.position.set(-8, 4, 8);
	directionalLight.castShadow = true;
	directionalLight.shadow.mapSize.set(2048, 2048);
	directionalLight.shadow.camera.near = 1.0;
	directionalLight.shadow.camera.far = 100;
	directionalLight.shadow.camera.top = 40;
	directionalLight.shadow.camera.right = 75;
	directionalLight.shadow.camera.bottom = -4;
	directionalLight.shadow.camera.left = -8;
	directionalLight.shadow.bias = -0.001;
	scene.add(directionalLight);

/*
	const helper = new THREE.DirectionalLightHelper(directionalLight, 5); // Create the helper
	scene.add(helper);

	const shadowCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
	scene.add(shadowCameraHelper);
*/

	/*directionalLight = new THREE.DirectionalLight('#1a272f', 1);
	directionalLight.position.set(-6, 15, -3);
	directionalLight.target.position.set(0, 3, 0);
	scene.add(directionalLight);*/
	/*scene.add(new THREE.DirectionalLightHelper(directionalLight));
*/
	model.scene.getObjectByName('lights').traverse((pointLight) => {
		if (!(pointLight instanceof THREE.PointLight)) return;

		pointLight.intensity = 1;
		pointLight.color = new THREE.Color("#8F564D");
		pointLight.decay = 4.0;
	});

	const bookStoreLight = new THREE.PointLight(
		new THREE.Color('#9C6258'),
		0.2,
		1
	);
	bookStoreLight.position.set(-1.05, 0.1, 1.2);

	scene.add(bookStoreLight);

	const storeLight = new THREE.PointLight(
		new THREE.Color('#9C6258'),
		0.2,
		1
	);
	storeLight.position.set(-1.05, 0.1, -0.4);

	scene.add(storeLight);

	const fgPointLight = new THREE.PointLight(
		new THREE.Color('#9C6258'),
		6.0,
		1.8
	);
	fgPointLight.position.copy(model.cameras[0].position);
	fgPointLight.position.x += 0.8;
	fgPointLight.position.y -= 0.2;
	fgPointLight.position.z -= 0.8;

	scene.add(
		fgPointLight,
		// new THREE.PointLightHelper(fgPointLight)
	);
}