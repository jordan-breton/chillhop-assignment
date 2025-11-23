import * as THREE from 'three';
import {applyMaterialToGroup, loadUvTexture} from '../utils/misc.js';

export default function initSuburb(scene, model) {
	const mainGroup = scene.getObjectByName('main');
	const mainTexture = loadUvTexture('/textures/FacadeBake_01(4K).webp');
	const mainMaterial = new THREE.MeshStandardMaterial({
		map: mainTexture,
		side: THREE.DoubleSide,
	});

	applyMaterialToGroup(mainGroup, mainMaterial);

	const lights = mainGroup.getObjectByName('Streetlights');
	lights.castShadow = false;
	lights.receiveShadow = false;
}