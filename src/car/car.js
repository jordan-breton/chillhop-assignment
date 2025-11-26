import * as THREE from "three";
import pathPoints from "./carpath.json";

const CARS = [
	{ color: "#d85d5d" },
	{ color: "#cfcf6e" },
	{ color: "#97e44f" },
	{ color: "#78cabb" },
];

export default function initCars(config, scene, model) {
	const baseCar = model.scene.getObjectByName("car");
	baseCar.visible = false;

	const points = pathPoints.map(p => new THREE.Vector3(p[0], p[2], -p[1]));
	const curve = new THREE.CatmullRomCurve3(points, false);

	const duration = 60;
	const carMaterials = {};

	const cars = CARS.map((entry, i) => {
		const clone = baseCar.clone(true);
		clone.visible = true;

		const emissiveMaterials = {};

		clone.traverse(carPart => {
			if (carPart instanceof THREE.Mesh) {
				carPart.castShadow = true;
			}

			if (carPart.material) {
				if (carPart.material.name in carMaterials) {
					carPart.material = carMaterials[carPart.material.name];
				} else {
					const name = carPart.material.name;
					carPart.material = new THREE.MeshToonMaterial(carPart.material);
					carPart.material.name = name;
					carMaterials[name] = carPart.material;
				}
			}

			if (carPart.material?.name === "Mat.1_3.001") {
				carPart.material = carPart.material.clone();
				carPart.material.color = new THREE.Color(entry.color);
			} else if (carPart.material?.name === "Mat.1_0.001") {
				carPart.material.color = new THREE.Color(1, 0, 0);
				carPart.material.emissive = new THREE.Color(1, 0, 0);
				carPart.material.emissiveIntensity = 1.0;
				emissiveMaterials[carPart.material.name] = carPart.material;
			} else if (carPart.material?.name === "front-lights") {
				carPart.material.color = new THREE.Color(1, 1, 0);
				carPart.material.emissive = new THREE.Color(1, 1, 0);
				carPart.material.emissiveIntensity = 1.0;
				emissiveMaterials[carPart.material.name] = carPart.material;
			}
		});

		const baseOffset = i / CARS.length;
		const jitter = (Math.random() - 0.5) * (1 / CARS.length) * 0.5;
		const offset = (baseOffset + jitter + 1) % 1;
		scene.add(clone);

		return { mesh: clone, offset, emissiveMaterials };
	});

	config.on(
		'changed',
		({detail: {
			'lights.cars.intensity': intensity,
		}}) => {
			cars.forEach(({ emissiveMaterials: materials }) => {
				Object.values(materials).forEach((material) => {
					material.emissiveIntensity = intensity;
				});
			});
		},
	);

	return {
		update(time) {
			const delta = time.deltaSeconds;
			const speed = 1 / duration;

			for (const car of cars) {
				car.offset = (car.offset + speed * delta) % 1;

				const pos = curve.getPoint(car.offset);
				car.mesh.position.copy(pos);

				const tangent = curve.getTangent(car.offset).normalize();
				car.mesh.quaternion.setFromUnitVectors(
					new THREE.Vector3(0, 0, 1),
					tangent
				);
			}
		},
	};
}
