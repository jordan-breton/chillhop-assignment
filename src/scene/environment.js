import * as THREE from 'three';
import {applyMaterialToGroup, loadUvTexture} from '../utils/misc.js';

export default function initEnvironment(scene, model) {
	const environmentGroup = scene.getObjectByName('environment');
	const environmentTexture = loadUvTexture('/textures/EnvironmentBake_01(4K).webp');
	const environmentMaterial = new THREE.MeshStandardMaterial({
		map: environmentTexture,
	});
	applyMaterialToGroup(environmentGroup, environmentMaterial);
}