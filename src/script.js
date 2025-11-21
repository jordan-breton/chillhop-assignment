import * as THREE from 'three';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
	EffectComposer,
	RenderPass,
	EffectPass,
	BlendFunction,
	HueSaturationEffect,
	ToneMappingEffect, Effect,
} from 'postprocessing';
import Stats from 'stats.js';
import Time from './utils/Time.js';
import Birds from './birds/Birds.js';
import Random from './utils/Random.js';
import {applyMaterialToGroup, loadUvTexture} from './utils/misc.js';
import Cat from './cat/Cat.js';

const stats = new Stats();
// document.body.appendChild(stats.dom);

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 325 });
const debugObject = {};
const dawnColor = new THREE.Color(0xffb878);
const nightColor = new THREE.Color(0x223366);

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(
	new THREE.Color("#ffffff"),
	0.001,
);

// Loaders
const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();

/**
 * Sizes
 */
const sizes = {
	width: 0,
	height: 0,
	pixelRatio: 1
};

function updateSizes() {
	sizes.height = Math.min(window.innerHeight);
	sizes.width = Math.min(window.innerWidth, sizes.height * 16/9);
	sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);
}

updateSizes();

/**
 * Camera
 */
let camera;
let controls;
let composer;
let cat;
let initialized = false;

const foliages = [];
const foliageMoves = [];

const gradientTexture = new THREE.TextureLoader().load('/textures/gradient.png');
gradientTexture.colorSpace = THREE.SRGBColorSpace;
gradientTexture.minFilter = THREE.LinearFilter;
gradientTexture.magFilter = THREE.LinearFilter;
gradientTexture.wrapS = THREE.ClampToEdgeWrapping;
gradientTexture.wrapT = THREE.ClampToEdgeWrapping;

const gradientTintEffect = new Effect(
	camera,
	`
precision highp float;

uniform sampler2D uGradient;

float luminance(vec3 color) {
    return dot(color, vec3(0.2126, 0.7152, 0.0722));
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Read original scene pixel
    vec4 tex = inputColor;
    
    // Convert sRGB -> linear
    vec3 color = pow(tex.rgb, vec3(2.2));
    
    // Compute luminance
    float lum = luminance(tex.rgb);
    
    // Sample gradient using luminance
    vec3 gradientColor = pow(texture2D(uGradient, vec2(lum, 0.0)).rgb, vec3(2.2));
    
    // Multiply scene color by gradient
    color *= gradientColor;
    
    // Back to sRGB
    color = pow(color, vec3(1.0 / 2.2));
    
    outputColor = vec4(color, tex.a);
}
    `,
	{
		blendFunction: BlendFunction.NORMAL, // we already multiplied inside
		uniforms: new Map([
			['uGradient', { value: gradientTexture }]
		])
	}
);

/**
 * Scene
 */
gltfLoader.load('/model.glb', (model) => {
	camera = model.cameras[0];

	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	scene.add(camera);

	scene.add(model.scene);

	const vegetationGroup = scene.getObjectByName('vegetation');
	const vegetationTexture = loadUvTexture('/textures/Foliage_01(2K).webp');
	const vegetationMaterial = new THREE.MeshBasicMaterial({
		map: vegetationTexture,
		transparent: true,
		depthWrite: false,
	});
	applyMaterialToGroup(vegetationGroup, vegetationMaterial);

	vegetationGroup.traverse((obj) => {
		if (!obj.name?.startsWith('foliage-')) {
			return;
		}

		foliages.push(obj);
		foliageMoves.push(Random.makeRandomSineCurve({ frequency: 0.4 }));
	});

	const environmentGroup = scene.getObjectByName('environment');
	const environmentTexture = loadUvTexture('/textures/EnvironmentBake_01(4K).webp');
	const environmentMaterial = new THREE.MeshBasicMaterial({
		map: environmentTexture,
	});
	applyMaterialToGroup(environmentGroup, environmentMaterial);

	const mainGroup = scene.getObjectByName('main');
	const mainTexture = loadUvTexture('/textures/FacadeBake_01(4K).webp');
	const mainMaterial = new THREE.MeshBasicMaterial({
		map: mainTexture,
	});
	applyMaterialToGroup(mainGroup, mainMaterial);

	cat = new Cat({
		mesh: scene.getObjectByName('Cat'),
		texture: loadUvTexture('/textures/Cat_01(2K).webp'),
	});

	baseQuat.copy(camera.quaternion);

	composer = new EffectComposer(renderer);
	composer.addPass(new RenderPass(scene, camera));

	const color = new THREE.Color(0xffb878).convertSRGBToLinear();
	const dawnEffect = new HueSaturationEffect({
		hue: -0.05,        // slightly orange
		saturation: 0.8,
		blendFunction: BlendFunction.HARD_LIGHT,
	});

	dawnEffect.blendMode.opacity.value = 0.4;

	// Night (cool)
	const nightEffect = new HueSaturationEffect({
		hue: -0.3,        // slightly blue
		saturation: 0.3,
		blendFunction: BlendFunction.MULTIPLY
	});

	const toneMappingEffect = new ToneMappingEffect();
	toneMappingEffect.toneMapping = THREE.ACESFilmicToneMapping;
	toneMappingEffect.exposure = 1.0;

// Choose one effect
	const effectPass = new EffectPass(
		camera,
		gradientTintEffect,
		toneMappingEffect,
	);
	composer.addPass(effectPass);

	initialized = true;
});

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 2);
directionalLight.position.set(6.25, 10, -8);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 30;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
scene.add(directionalLight);

let canvasRect = canvas.getBoundingClientRect();

window.addEventListener('resize', () => {
    updateSizes();

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(sizes.pixelRatio);

	canvasRect = canvas.getBoundingClientRect();
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setClearColor(scene.fog.color);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.NoToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

const time = new Time();
const birds = new Birds({
	birdCount: 5,
	texture: textureLoader.load('/textures/bird.webp'),
	scene,
});

const target = { x: 0, y: 0 };

const maxTiltX = 0.05; // pitch
const maxTiltY = 0.05; // yaw

const baseQuat = new THREE.Quaternion();
const tiltQuat = new THREE.Quaternion();
const finalQuat = new THREE.Quaternion();

canvas.addEventListener('pointerdown', (e) => e.preventDefault());
canvas.addEventListener('pointermove', (e) => {
	const nx = (((e.clientX - canvasRect.left) / sizes.width) * 2 - 1) * 0.35;
	const ny = (((e.clientY - canvasRect.top) / sizes.height) * 2 - 2) * 0.35;

	target.y = nx * maxTiltY;
	target.x = ny * maxTiltX;
}, { passive: false });

const tick = () => {
	stats.begin();

	time.tick();

	if (initialized) {
		if (controls) controls.update();

		foliages.forEach((foliage, i) => {
			foliage.rotation.x = foliageMoves[i](time.elapsedSeconds) * 0.02;
		});

		cat.update(time);
		birds.update(time);

		tiltQuat.setFromEuler(
			new THREE.Euler(target.x, target.y, 0, 'YXZ'),
		);
		finalQuat.copy(baseQuat).multiply(tiltQuat);
		camera.quaternion.slerp(finalQuat, 0.12);

		// renderer.render(scene, camera);
		composer.render();
	}

	stats.end();
    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();