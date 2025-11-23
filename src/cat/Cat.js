import * as THREE from 'three';
import fragmentShader from './shaders/fragment.glsl';
import vertexShader from './shaders/vertex.glsl';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';

export default function initCat(mesh, texture) {
	const material = new CustomShaderMaterial({
		baseMaterial: THREE.MeshStandardMaterial,
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		uniforms: {
			uTime: new THREE.Uniform(0),
			uTexture: new THREE.Uniform(texture),
		},
		transparent: true,
	});

	mesh.material = material;

	return {
		update(time) {
			material.uniforms.uTime.value = time.elapsedSeconds;
		}
	}
}