import * as THREE from 'three';
import {
	BloomEffect,
	EffectComposer,
	EffectPass,
	RenderPass,
	SMAAEffect,
	SMAAPreset,
	ToneMappingEffect,
} from 'postprocessing';

export default function initPostprocessing(config, scene, camera, renderer, gui) {
	const composer = new EffectComposer(renderer);
	composer.addPass(new RenderPass(scene, camera));

	const toneMappingEffect = new ToneMappingEffect();
	toneMappingEffect.toneMapping = THREE.ACESFilmicToneMapping;
	toneMappingEffect.exposure = 1.0;

	const bloomEffect = new BloomEffect({
		luminanceThreshold: 1.0,
		intensity: 0,
	});

	config.on(
		'changed',
		({ detail: {
			'bloom.intensity': intensity,
			'bloom.threshold': threshold,
		} }) => {
		bloomEffect.intensity = intensity;
		bloomEffect.luminanceMaterial.threshold = threshold;
	});

	const effectPass = new EffectPass(
		camera,
		bloomEffect,
		new SMAAEffect({
			preset: SMAAPreset.MEDIUM,
		}),
		toneMappingEffect,
	);

	composer.addPass(effectPass);

	return composer;
}