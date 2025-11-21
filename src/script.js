import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 325 });
const debugObject = {};

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Loaders
const rgbeLoader = new RGBELoader();
const gltfLoader = new GLTFLoader();

/**
 * Environment map
 */
/*rgbeLoader.load('/spruit_sunrise.hdr', (environmentMap) =>
{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;

    scene.background = environmentMap;
    scene.backgroundBlurriness = 0.5;
    scene.environment = environmentMap;
});*/

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
	pixelRatio: Math.min(window.devicePixelRatio, 2)
};

/**
 * Camera
 */
// Default Camer
let camera// = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
// camera.position.set(-10, 6, -2);
// scene.add(camera);
let controls;

/**
 * Scene
 */
gltfLoader.load('/model.glb', (model) => {
	camera = model.cameras[0];

	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	scene.add(camera);

	scene.add(model.scene);
	console.log(model);

	// Controls
	// controls = new OrbitControls(camera, canvas);
	// controls.enableDamping = true;
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

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = Math.min(window.innerWidth, 2105);
    sizes.height = Math.min(window.innerHeight, 1216);
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(sizes.pixelRatio);
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    if (controls) controls.update();

    // Render
    if (camera) renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();