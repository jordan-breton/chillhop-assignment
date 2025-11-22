import fragmentShader from './shaders/fragment.glsl';
import * as THREE from 'three';
import {BlendFunction, Effect} from 'postprocessing';

export default class Atmosphere {
	constructor({
		gui,
		camera,
		textureLoader,
		gradientMapUrl = '/textures/gradient-map.png',
	}) {
		const texture = this.initTexture(textureLoader, gradientMapUrl);
		this.effect = this.initEffect(gui, camera, texture);
	}

	initTexture(textureLoader, url) {
		const gradientTexture = textureLoader.load(url);

		gradientTexture.magFilter = THREE.NearestFilter;
		gradientTexture.minFilter = THREE.NearestFilter;
		gradientTexture.generateMipmaps = false;
		gradientTexture.wrapS = THREE.ClampToEdgeWrapping;
		gradientTexture.wrapT = THREE.ClampToEdgeWrapping;
		gradientTexture.colorSpace = THREE.SRGBColorSpace;

		return gradientTexture;
	}

	initEffect(gui, camera, texture) {
		const gradientTintEffect = new Effect(
			camera,
			fragmentShader,
			{
				blendFunction: BlendFunction.NORMAL, // we already multiplied inside
				uniforms: new Map([
					['uGradient', { value: texture }],
					['uIndex',    { value: 5 }],   // 1–32
					['uCount',    { value: 32 }]   // total number of gradients
				])
			}
		);

		gui.add(
			gradientTintEffect.uniforms.get('uIndex'),
			"value",
			1, 32, 1
		)
			.name("Atmosphere");

		return gradientTintEffect;
	}
}