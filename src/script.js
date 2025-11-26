import * as THREE from 'three';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Stats from 'stats.js';
import Time from './utils/Time.js';
import {loadUvTexture} from './utils/misc.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import initLights from './lights.js';
import initPostprocessing from './postprocess.js';
import initCameraController from './cameraController.js';
import initVegetation from './scene/vegetation.js';
import initCat from './cat/Cat.js';
import initEnvironment from './scene/environment.js';
import initSuburb from './scene/suburb.js';
import initBirds from './birds/Birds.js';
import initCars from './car/car.js';
import initWater from './water/water.js';
import initPlane from './plane/plane.js';
import Config from './Config.js';
import {getGPUTier} from 'detect-gpu';
import initAudio from './audio.js';

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

//endregion
//region Loaders

const textureLoader = new THREE.TextureLoader();
const rgbeLoader = new RGBELoader();
const gltfLoader = new GLTFLoader();

//endregion
//region Sizes
let composer;

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

	if (composer) {
		composer.setSize(sizes.width, sizes.height);
	}

	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(sizes.pixelRatio);
});

//endregion
//region Renderer

const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	alpha: false,
	antialias: false,
});
renderer.setClearColor(0x000000, 0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.NoToneMapping;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

//endregion

const config = new Config(gui);

//region DayTime buttons binding

const buttons = document.querySelectorAll('.weather-btn');

buttons.forEach(btn => {
	btn.addEventListener('pointerdown', (e) => {
		config.set(btn.getAttribute('data-time'));

		buttons.forEach(btn => btn.classList.remove('selected'));
		btn.classList.add('selected');
	});
});

//endregion

function start(model) {
	const time = new Time();
	const camera = model.cameras[0];

	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	scene.add(camera, model.scene);

	const audio = initAudio(config);
	const lights = initLights(config, scene, model);

	initEnvironment(config, scene, model);
	initSuburb(config, scene);

	const vegetation       = initVegetation(scene, model);
	const cameraController = initCameraController(canvas, camera, sizes);

	composer = initPostprocessing(config, scene, camera, renderer, gui);

	const cat = initCat(
		scene.getObjectByName('Cat'),
		loadUvTexture('/textures/Cat_01(2K).webp'),
	);
	const birds = initBirds(
		scene,
		textureLoader.load('/textures/bird.webp'),
		5,
	);
	const car = initCars(config, scene, model);
	const plane = initPlane(config, scene, model);
	const water = initWater(config, scene, model);

	config.set('day');

	const tick = () => {
		stats.begin();

		time.tick();

		lights.update(camera);
		vegetation.update(time);
		cat.update(time);
		birds.update(time);
		cameraController.update();
		car.update(time);
		plane.update(time);
		water.update(time);

		composer.render();

		stats.end();

		window.requestAnimationFrame(tick);
	};

	tick();

	getGPUTier().then(({ tier, isMobile, type }) => {
		if (type === 'FALLBACK') {
			return;
		}

		if (tier < 2) {
			renderer.shadowMap.enabled = false;
			lights.main.disableShadowCasting();
		}
	});

	const overlay = document.getElementById('overlay');
	const enterButton = overlay.querySelector('button');

	overlay.style.display = 'none';
	enterButton.addEventListener('click', (e) => {
		overlay.style.display = 'none';

		audio.start();
	});
}

gltfLoader.load('/model.glb', start);