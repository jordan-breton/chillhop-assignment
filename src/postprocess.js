import * as THREE from 'three';
import {
	BloomEffect,
	EffectComposer,
	EffectPass,
	RenderPass,
	SMAAEffect,
	ToneMappingEffect
} from 'postprocessing';

export default function initPostprocessing(scene, camera, renderer, gui) {
	const composer = new EffectComposer(renderer);
	composer.addPass(new RenderPass(scene, camera));

	/*atmosphere = new Atmosphere({
		gui,
		camera,
		textureLoader,
		gradientMapUrl: '/textures/gradient-map.png'
	});*/

	const toneMappingEffect = new ToneMappingEffect();
	toneMappingEffect.toneMapping = THREE.ACESFilmicToneMapping;
	toneMappingEffect.exposure = 1.0;

	const bloomEffect = new BloomEffect({
		luminanceThreshold: 0.955,
		intensity: 0.44,
	});

	gui.add(bloomEffect, "intensity", 0.0, 2.5, 0.01)
		.name("Bloom Intensity");

	gui.add(bloomEffect.luminanceMaterial, "threshold", 0.0, 1.5, 0.001)
		.name("Bloom Threshold");

	const effectPass = new EffectPass(
		camera,
		// atmosphere.effect,
		bloomEffect,
		new SMAAEffect(),
		toneMappingEffect,
	);

	composer.addPass(effectPass);

	return composer;
}