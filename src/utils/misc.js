import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

export function loadUvTexture(url) {
	const texture = textureLoader.load(url);

	texture.colorSpace = THREE.SRGBColorSpace;
	texture.flipY = false;

	return texture;
}

export function applyMaterialToGroup(group, material) {
	group.traverse((obj) => {
		if (obj instanceof THREE.Mesh) {
			obj.material = material;
			obj.castShadow = true;
			obj.receiveShadow = true;
		}
	});
}