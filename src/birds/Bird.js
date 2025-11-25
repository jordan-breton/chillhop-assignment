import * as THREE from 'three';
import birdVertexShader from "./shaders/vertex.glsl";
import birdFragmentShader from "./shaders/fragment.glsl";
import CurvedPathUtils from "../utils/CurvedPathUtils.js";
import Random from "../utils/Random.js";
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';

export default class Bird {
	static id = 0;

	static getNewId() {
		return Bird.id++;
	}

	constructor({ texture, geometry, scene, boundingBox }) {
		this.id = Bird.getNewId();
		this.geometry = geometry;
		this.boundingBox = boundingBox;
		this.texture = texture;
		this.wrapper = new THREE.Group();

		scene.add(this.wrapper);

		this.init();
	}

	init() {
		this.createMaterial();
		this.createMesh();
		this.generateRandomPath();
	}

	createMaterial() {
		this.material = new CustomShaderMaterial({
			baseMaterial: THREE.MeshToonMaterial,
			transparent: true,
			side: THREE.DoubleSide,
			vertexShader: birdVertexShader,
			fragmentShader: birdFragmentShader,
			uniforms: {
				uTime: { value: 0 },
				uSize: { value: 0.04 },
				uTexture: { value: this.texture },
				uColor: { value: new THREE.Color('#d2d2d2') },
			}
		});
	}

	createMesh() {
		this.mesh = new THREE.Mesh(this.geometry, this.material);

		this.mesh.receiveShadow = true;
		this.mesh.castShadow = true;
		this.mesh.rotation.x = -Math.PI * 0.5;
		this.mesh.rotation.z = Math.PI;

		const size = 3;
		this.mesh.scale.set(
			size,
			size,
			size
		);

		this.wrapper.add(this.mesh);
	}

	createRandomCurvePoint() {
		return Random.pointInBox(this.boundingBox);
	}

	generateRandomPath() {
		const points = Array(5).fill(0).map(() => this.createRandomCurvePoint());
		this.path = new CurvedPathUtils({ points });
	}

	update(time) {
		if (!this.material) return;

		this.material.uniforms.uTime.value = time.elapsedSeconds * 0.95 + (this.id * 10);
		this.updatePositionOnPath(time.deltaSeconds);
	}

	updatePositionOnPath(deltaSeconds) {
		const { position, tangent } = this.path.getPositionAndTangent(deltaSeconds);
		this.wrapper.position.copy(position);
		this.wrapper.lookAt(position.clone().add(tangent));
	}
}
