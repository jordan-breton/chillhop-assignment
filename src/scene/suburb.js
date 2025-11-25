import * as THREE from 'three';
import {applyMaterialToGroup, loadUvTexture} from '../utils/misc.js';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import fragmentShader from './shaders/fragment.glsl';
import vertexShader from './shaders/vertex.glsl';

export default function initSuburb(config, scene) {
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
		baseMaterial: THREE.MeshToonMaterial,
		fragmentShader,
		vertexShader,
		map: mainTexture,
		uniforms: {
			uLightIntensity: new THREE.Uniform(250.0),
			uLightColor: new THREE.Uniform(new THREE.Color('#8F564D')),
			uLightsTexture: new THREE.Uniform(lightsTexture),
		}
	});

	config.on(
		'changed',
		({detail: {
			'lights.windows.main.color': color,
			'lights.windows.main.intensity': intensity,
		}}) => {
			mainMaterial.uniforms.uLightIntensity.value = intensity;
			mainMaterial.uniforms.uLightColor.value.set(color);
		},
	);

	applyMaterialToGroup(mainGroup, mainMaterial);

	const lights = mainGroup.getObjectByName('Streetlights');
	lights.castShadow = true;
	lights.receiveShadow = true;
}