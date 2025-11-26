import * as THREE from 'three';

function initMainLight(config, scene) {
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

	config.on(
		'changed',
		({detail: {
			'lights.main.enabled': enabled,
			'lights.main.color': color,
			'lights.main.intensity': intensity,
		}}) => {
			directionalLight.visible = enabled;
			directionalLight.color.set(color);
			directionalLight.intensity = intensity;
		}
	);

	return {
		disableShadowCasting() {
			directionalLight.castShadow = false;
			directionalLight.shadow.map.dispose();
			directionalLight.shadow.map = null;
		},
		downScaleShadowMap(width, height) {
			directionalLight.shadow.map.dispose();
			directionalLight.shadow.mapSize.set(width, height);
			directionalLight.shadow.map = null;
		}
	};
}

function initStreetLights(config, model) {
	const pointLights = [];

	model.scene.getObjectByName('lights').traverse((pointLight) => {
		if (!(pointLight instanceof THREE.PointLight)) return;

		pointLight.intensity = 1;
		pointLight.color = new THREE.Color("#8F564D");
		pointLight.decay = 4.0;

		pointLights.push(pointLight);
	});

	config.on(
		'changed',
		({detail: {
			'lights.street.enabled': enabled,
			'lights.street.color': color,
			'lights.street.intensity': intensity,
			'lights.street.decay': decay,
		}}) => {
			pointLights.forEach((pointLight) => {
				pointLight.visible = enabled;
				pointLight.color.set(color);
				pointLight.intensity = intensity;
				pointLight.decay = decay;
			});
		}
	);

	const frustum = new THREE.Frustum();
	const cameraViewProjectionMatrix = new THREE.Matrix4();

	return {
		update(camera) {
			camera.updateMatrixWorld();
			camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
			cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
			frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);

			pointLights.forEach(light => {
				const sphere = new THREE.Sphere(light.position, light.distance);
				light.visible = frustum.intersectsSphere(sphere);
			});
		}
	};
}

function initBookStoreLight(config, scene) {
	const bookStoreLight = new THREE.PointLight(
		new THREE.Color('#9C6258'),
		0.2,
		1
	);
	bookStoreLight.position.set(-1.05, 0.1, 1.2);

	scene.add(bookStoreLight);

	config.on(
		'changed',
		({detail: {
			'lights.bookStore.enabled': enabled,
			'lights.bookStore.color': color,
			'lights.bookStore.intensity': intensity,
			'lights.bookStore.distance': distance,
		}}) => {
			bookStoreLight.visible = enabled;
			bookStoreLight.color.set(color);
			bookStoreLight.intensity = intensity;
			bookStoreLight.distance = distance;
		},
	);

	return {
		disable() {
			bookStoreLight.visible = false;
		}
	};
}

function initStoreLight(config, scene) {
	const storeLight = new THREE.PointLight(
		new THREE.Color('#9C6258'),
		0.3,
		1
	);
	storeLight.position.set(-1.05, 0.1, -0.4);

	scene.add(storeLight);

	config.on(
		'changed',
		({detail: {
			'lights.store.enabled': enabled,
			'lights.store.color': color,
			'lights.store.intensity': intensity,
			'lights.store.distance': distance,
		}}) => {
			storeLight.visible = enabled;
			storeLight.color.set(color);
			storeLight.intensity = intensity;
			storeLight.distance = distance;
		},
	);

	return {
		disable() {
			storeLight.visible = false;
		}
	};
}

function initForegroundLight(config, scene, model) {
	const fgPointLight = new THREE.PointLight(
		new THREE.Color('#9C6258'),
		6.0,
		1.8
	);
	fgPointLight.position.copy(model.cameras[0].position);
	fgPointLight.position.x += 0.8;
	fgPointLight.position.y -= 0.2;
	fgPointLight.position.z -= 0.8;

	scene.add(fgPointLight);

	config.on(
		'changed',
		({detail: {
			'lights.fg.enabled': enabled,
			'lights.fg.color': color,
			'lights.fg.intensity': intensity,
			'lights.fg.distance': distance,
		}}) => {
			fgPointLight.visible = enabled;
			fgPointLight.color.set(color);
			fgPointLight.intensity = intensity;
			fgPointLight.distance = distance;
		},
	);

	return {
		disable() {
			fgPointLight.visible = false;
		}
	};
}

export default function initLights(config, scene, model) {
	return {
		main: initMainLight(config, scene),
		street: initStreetLights(config, model),
		bookStore: initBookStoreLight(config, scene),
		store: initStoreLight(config, scene),
		fg: initForegroundLight(config, scene, model),
		update(camera) {
			this.street.update(camera);
		}
	}
}