import * as THREE from 'three';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import {applyMaterialToGroup, loadUvTexture} from '../utils/misc.js';
import fragmentShader from './shaders/fragment.glsl';
import vertexShader from './shaders/vertex.glsl';
import skyFragmentShader  from './shaders/sky/fragment.glsl';
import skyVertexShader from './shaders/sky/vertex.glsl';

export default function initEnvironment(config, scene, model) {
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

	config.on(
		'changed',
		({detail: {
			'sky.color.start': skyStartColor,
			'sky.color.end': skyEndColor,
			'lights.windows.bg.color': color,
			'lights.windows.bg.intensity': intensity,
		}}) => {
			sky.material.uniforms.uStartColor.value.set(skyStartColor);
			sky.material.uniforms.uEndColor.value.set(skyEndColor);

			environmentMaterial.uniforms.uLightIntensity.value = intensity;
			environmentMaterial.uniforms.uLightColor.value.set(color);
		},
	);

	applyMaterialToGroup(environmentGroup, environmentMaterial);

	const sky = model.scene.getObjectByName('Sky');
	sky.material = new THREE.ShaderMaterial({
		vertexShader: skyVertexShader,
		fragmentShader: skyFragmentShader,
		uniforms: {
			uMap: new THREE.Uniform(environmentTexture),
			uStartColor: new THREE.Uniform(new THREE.Color('#ff0000')),
			uEndColor: new THREE.Uniform(new THREE.Color('#00ff00')),
		}
	});
}