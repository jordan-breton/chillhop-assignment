import * as THREE from 'three';
import {applyMaterialToGroup, loadUvTexture} from '../utils/misc.js';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import fragmentShader from './shaders/fragment.glsl';
import vertexShader from './shaders/vertex.glsl';

export default function initSuburb(scene, model) {
	const mainGroup = scene.getObjectByName('main');
	const mainTexture = loadUvTexture('/textures/FacadeBake_01(4K).webp');
	const lightsTexture = loadUvTexture('/textures/FacadeBake_01(4K)-lights.png');
	lightsTexture.magFilter = THREE.LinearFilter;
	lightsTexture.minFilter = THREE.LinearFilter;
	lightsTexture.generateMipmaps = false;
	lightsTexture.wrapS = THREE.ClampToEdgeWrapping;
	lightsTexture.wrapT = THREE.ClampToEdgeWrapping;
	lightsTexture.colorSpace = THREE.SRGBColorSpace;

	const mainMaterial = new CustomShaderMaterial({
		baseMaterial: THREE.MeshStandardMaterial,
		fragmentShader,
		vertexShader,
		map: mainTexture,
		uniforms: {
			uLightsTexture: new THREE.Uniform(lightsTexture),
		}
	});

	applyMaterialToGroup(mainGroup, mainMaterial);

	const lights = mainGroup.getObjectByName('Streetlights');
	lights.castShadow = false;
	lights.receiveShadow = false;
}