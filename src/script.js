import * as THREE from 'three';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Stats from 'stats.js';
import Time from './utils/Time.js';
import Birds from './birds/Birds.js';
import {applyMaterialToGroup, loadUvTexture} from './utils/misc.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import initLights from './lights.js';
import initPostprocessing from './postprocess.js';
import initCameraController from './cameraController.js';
import initVegetation from './scene/vegetation.js';
import initCat from './cat/Cat.js';
import initEnvironment from './scene/environment.js';
import initSuburb from './scene/suburb.js';
import initBirds from './birds/Birds.js';

const canvas = document.querySelector('canvas.webgl');

//region Perf monitor

const stats = new Stats();
document.body.appendChild(stats.dom);

//endregion
//region Debug gui

const gui = new GUI({ width: 325 });

//endregion
//region Scene

const scene = new THREE.Scene();

scene.fog = new THREE.FogExp2(
	new THREE.Color("#ffffff"),
	0.001,
);

//endregion
//region Loaders

const textureLoader = new THREE.TextureLoader();
const rgbeLoader = new RGBELoader();
const gltfLoader = new GLTFLoader();

//endregion
//region Sizes
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

window.addEventListener('resize', () => {
	updateSizes();

	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(sizes.pixelRatio);
});

//endregion
//region Renderer

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

//endregion

function start(model) {
	const time = new Time();
	const camera = model.cameras[0];

	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	scene.add(camera, model.scene);

	initEnvironment(scene, camera);
	initSuburb(scene, camera);
	initLights(scene, model);

	const vegetation       = initVegetation(scene, model);
	const cameraController = initCameraController(canvas, camera, sizes);
	const composer         = initPostprocessing(scene, camera, renderer, gui);

	const cat = initCat(
		scene.getObjectByName('Cat'),
		loadUvTexture('/textures/Cat_01(2K).webp'),
	);
	const birds = initBirds(
		scene,
		textureLoader.load('/textures/bird.webp'),
		15,
	);

	const tick = () => {
		stats.begin();

		time.tick();

		vegetation.update(time);
		cat.update(time);
		birds.update(time);
		cameraController.update();

		composer.render();

		stats.end();

		window.requestAnimationFrame(tick);
	};

	tick();
}

gltfLoader.load('/model.glb', start);