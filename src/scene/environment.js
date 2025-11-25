import * as THREE from 'three';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import {applyMaterialToGroup, loadUvTexture} from '../utils/misc.js';
import fragmentShader from './shaders/fragment.glsl';
import vertexShader from './shaders/vertex.glsl';

export default function initEnvironment(scene, model) {
	const environmentGroup = scene.getObjectByName('environment');
	const environmentTexture = loadUvTexture('/textures/EnvironmentBake_01(4K).webp');

	const lightsTexture = loadUvTexture('/textures/EnvironmentBake_01(4K)-lights.webp');
	lightsTexture.magFilter = THREE.LinearFilter;
	lightsTexture.minFilter = THREE.LinearFilter;
	lightsTexture.generateMipmaps = false;
	lightsTexture.wrapS = THREE.ClampToEdgeWrapping;
	lightsTexture.wrapT = THREE.ClampToEdgeWrapping;
	lightsTexture.colorSpace = THREE.SRGBColorSpace;

	let environmentMaterial = new CustomShaderMaterial({
		baseMaterial: THREE.MeshToonMaterial,
		fragmentShader,
		vertexShader,
		map: environmentTexture,
		uniforms: {
			uLightIntensity: new THREE.Uniform(125.0),
			uLightColor: new THREE.Uniform(new THREE.Color('#985D55')),
			uLightsTexture: new THREE.Uniform(lightsTexture),
		}
	});

	applyMaterialToGroup(environmentGroup, environmentMaterial);
}