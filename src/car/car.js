import * as THREE from "three";
import pathPoints from "./carpath.json";

const CARS = [
	{ color: "#d85d5d" },
	{ color: "#cfcf6e" },
	{ color: "#97e44f" },
	{ color: "#78cabb" },
];

export default function initCar(scene, model) {
	const baseCar = model.scene.getObjectByName("car");
	baseCar.visible = false; // hide the original

	const points = pathPoints.map(p => new THREE.Vector3(p[0], p[2], -p[1]));
	const curve = new THREE.CatmullRomCurve3(points, false);

	const duration = 60;

	const cars = CARS.map((entry, i) => {
		const clone = baseCar.clone(true);
		clone.visible = true;

		clone.traverse(carPart => {
			if (carPart.material?.name === "Mat.1_3.001") {
				carPart.material = carPart.material.clone();
				carPart.material.color = new THREE.Color(entry.color);
			}

			if (carPart.material?.name === "Mat.1_0.001") {
				carPart.material.color = new THREE.Color(1, 0, 0);
				carPart.material.emissive = new THREE.Color(1, 0, 0);
				carPart.material.emissiveIntensity = 110.0;
			}

			if (carPart.material?.name === "front-lights") {
				carPart.material.color = new THREE.Color(1, 1, 0);
				carPart.material.emissive = new THREE.Color(1, 1, 0);
				carPart.material.emissiveIntensity = 250.0;
			}
		});

		const baseOffset = i / CARS.length;
		const jitter = (Math.random() - 0.5) * (1 / CARS.length) * 0.5; // ≤ 50% of spacing
		const offset = (baseOffset + jitter + 1) % 1;
		scene.add(clone);

		return { mesh: clone, offset };
	});

	return {
		update(time) {
			const tGlobal = (time.elapsedSeconds % duration) / duration;

			for (const { mesh, offset } of cars) {
				const t = (tGlobal + offset) % 1;

				const pos = curve.getPoint(t);
				mesh.position.copy(pos);

				const tangent = curve.getTangent(t);
				mesh.quaternion.setFromUnitVectors(
					new THREE.Vector3(0, 0, 1),
					tangent.normalize()
				);
			}
		},
	};
}
