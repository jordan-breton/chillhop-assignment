import * as THREE from 'three';
import fragmentShader from './shaders/fragment.glsl';
import vertexShader from './shaders/vertex.glsl';

export default class Cat {
	constructor({mesh, texture}){
		this.mesh = mesh;
		this.material = new THREE.ShaderMaterial({
			fragmentShader,
			vertexShader,
			uniforms: {
				uTime: new THREE.Uniform(0),
				uTexture: new THREE.Uniform(texture),
			},
			transparent: true,
		});

		this.mesh.material = this.material;
	}

	update(time) {
		this.material.uniforms.uTime.value = time.elapsedSeconds;
	}
}