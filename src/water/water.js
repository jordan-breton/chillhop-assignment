import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

export default function initWater(scene, model) {
	const water = model.scene.getObjectByName("Water");

	const waterMaterial = new CustomShaderMaterial({
		baseMaterial: THREE.MeshToonMaterial,
		blending: THREE.AdditiveBlending,
		uniforms: {
			uTime: { value: 0 },
			uColor: { value: new THREE.Color("#f8d5ae") },
			uGlintIntensity: { value: 1500.0 },
			uNoiseScale: { value: 900.0 }
		},
		vertexShader,
		fragmentShader,
	});

	water.material = waterMaterial;

	return {
		update(time) {
			waterMaterial.uniforms.uTime.value = time.elapsedSeconds;
		}
	};
}
