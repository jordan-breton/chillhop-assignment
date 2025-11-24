import {applyMaterialToGroup, loadUvTexture} from '../utils/misc.js';
import * as THREE from 'three';
import Random from '../utils/Random.js';

export default function initVegetation(scene, model) {
	const vegetationGroup = scene.getObjectByName('vegetation');
	const vegetationTexture = loadUvTexture('/textures/Foliage_01(2K).webp');
	const vegetationMaterial = new THREE.MeshStandardMaterial({
		map: vegetationTexture,
		transparent: true,
		depthWrite: false,
	});

	applyMaterialToGroup(vegetationGroup, vegetationMaterial);

	const foliages = [];
	const foliageMoves = [];

	vegetationGroup.traverse((obj) => {
		if (!obj.name?.startsWith('foliage-')) {
			return;
		}

		foliages.push(obj);
		foliageMoves.push(Random.makeRandomSineCurve({ frequency: 0.4 }));
	});

	return {
		update(time) {
			foliages.forEach((foliage, i) => {
				foliage.rotation.x = foliageMoves[i](time.elapsedSeconds) * 0.035;
			});
		}
	}
}