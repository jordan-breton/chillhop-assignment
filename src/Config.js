import EventEmitter from './utils/EventEmitter.js';

const CONFIGS = {
	dawn: {
		'music': '/music/sunrise.mp3',

		'sky.color.end': "#9D625A",
		'sky.color.start': "#5D476B",

		'bloom.intensity': 0.45,
		'bloom.threshold': 0.3338,

		'lights.ambient.enabled': true,
		'lights.ambient.color': '#472a65',
		'lights.ambient.intensity': 5.8,

		'lights.main.enabled': true,
		'lights.main.color': '#FFC681',
		'lights.main.intensity': 0.53,

		'lights.street.enabled': true,
		'lights.street.intensity': 0.96,
		'lights.street.color': "#ffa50a",
		'lights.street.decay': 2.0,

		'lights.bookStore.enabled': true,
		'lights.bookStore.intensity': 0.16,
		'lights.bookStore.color': "#897098",
		'lights.bookStore.distance': 1,

		'lights.store.enabled': true,
		'lights.store.intensity': 0.27,
		'lights.store.color': "#897098",
		'lights.store.distance': 1,

		'lights.fg.enabled': true,
		'lights.fg.intensity': 50,
		'lights.fg.color': "#ffa50a",
		'lights.fg.distance': 1.48,

		'lights.windows.main.intensity': 8,
		'lights.windows.main.color': '#897098',

		'lights.windows.bg.intensity': 10,
		'lights.windows.bg.color': '#897098',

		'lights.cars.intensity': 1,
		'lights.plane.intensity': 1,

		'water.glint.intensity': 10,
		'water.glint.color': "#ffffff",
		'water.glint.size': 1050,
	},
	day: {
		'music': '/music/day.mp3',

		'sky.color.end': "#EDE7D9",
		'sky.color.start': "#8BD8D2",

		'bloom.intensity': 0.4,
		'bloom.threshold': 0.649,

		'lights.ambient.enabled': true,
		'lights.ambient.color': '#f0e4d4',
		'lights.ambient.intensity': 0.4,

		'lights.main.enabled': true,
		'lights.main.color': '#FFC681',
		'lights.main.intensity': 4.57,

		'lights.street.enabled': false,
		'lights.street.intensity': 1.0,
		'lights.street.color': "#8F564D",
		'lights.street.decay': 4.0,

		'lights.bookStore.enabled': false,
		'lights.bookStore.intensity': 0.2,
		'lights.bookStore.color': "#9C6258",
		'lights.bookStore.distance': 1,

		'lights.store.enabled': false,
		'lights.store.intensity': 0.3,
		'lights.store.color': "#9C6258",
		'lights.store.distance': 1,

		'lights.fg.enabled': true,
		'lights.fg.intensity': 6,
		'lights.fg.color': "#ffa50a",
		'lights.fg.distance': 1.8,

		'lights.windows.main.intensity': 0,
		'lights.windows.main.color': '#8F564D',

		'lights.windows.bg.intensity': 0,
		'lights.windows.bg.color': '#985D55',

		'lights.cars.intensity': 0,
		'lights.plane.intensity': 0,

		'water.glint.intensity': 2500,
		'water.glint.color': "#ffffff",
		'water.glint.size': 650,
	},
	night: {
		'music': '/music/night.mp3',

		'sky.color.start': "#1C262F",
		'sky.color.end': "#213E50",

		'bloom.intensity': 0.35,
		'bloom.threshold': 0,

		'lights.ambient.enabled': false,
		'lights.ambient.color': '#F2E2CB',
		'lights.ambient.intensity': 0.4,

		'lights.main.enabled': true,
		'lights.main.color': '#213E50',
		'lights.main.intensity': 2,

		'lights.street.enabled': true,
		'lights.street.intensity': 1.0,
		'lights.street.color': "#8F564D",
		'lights.street.decay': 4,

		'lights.bookStore.enabled': true,
		'lights.bookStore.intensity': 0.2,
		'lights.bookStore.color': "#9C6258",
		'lights.bookStore.distance': 1,

		'lights.store.enabled': true,
		'lights.store.intensity': 0.3,
		'lights.store.color': "#9C6258",
		'lights.store.distance': 1,

		'lights.fg.enabled': true,
		'lights.fg.intensity': 6,
		'lights.fg.color': "#9C6258",
		'lights.fg.distance': 1.8,

		'lights.windows.main.enabled': true,
		'lights.windows.main.intensity': 250,
		'lights.windows.main.color': '#8F564D',

		'lights.windows.bg.enabled': true,
		'lights.windows.bg.intensity': 125,
		'lights.windows.bg.color': '#985D55',

		'lights.cars.intensity': 1,
		'lights.plane.intensity': 1,

		'water.glint.intensity': 2,
		'water.glint.color': "#f8d5ae",
		'water.glint.size': 1050,
	},
};

export default class Config extends EventEmitter {
	constructor(gui) {
		super();

		const buttons = Object.fromEntries(
			Object.keys(CONFIGS).map((configName) => [
				configName,
				() => this.set(configName),
			])
		);

		Object.entries(CONFIGS).forEach(([key, conf]) => {
			const presetFolder = gui.addFolder(key);

			this.#addConfigToGui(
				presetFolder,
				conf,
			);

			presetFolder.close();
		});
	}

	#addConfigToGui(folder, config) {
		this.#addBloomGui(folder, config);
		this.#addSkyConfigToGui(folder, config);
		this.#addLightsConfigToGui(folder, config);
		this.#addWaterConfigToGui(folder, config);

		folder.onChange(() => {
			if (this.config !== config) {
				return;
			}

			this.emit('changed', config);
		});
	}

	#addSkyConfigToGui(folder, config) {
		const sky = folder.addFolder('Sky');

		sky.addColor(config, 'sky.color.start')
			.name('start color');

		sky.addColor(config, 'sky.color.end')
			.name('end color');

		sky.close();
	}

	#addWaterConfigToGui(folder, config) {
		const water = folder.addFolder('Water');

		water.addColor(config, 'water.glint.color')
			.name('Glint color');

		water.add(config, 'water.glint.intensity')
			.name('Glint intensity')
			.min(0)
			.max(2500)
			.step(0.01);

		water.add(config, 'water.glint.size')
			.name('Glint size')
			.min(0)
			.max(2000)
			.step(0.01);

		water.close();
	}

	#addLightsConfigToGui(folder, config) {
		const lightsFolder = folder.addFolder('Lights');

		this.#addAmbientLightGui(lightsFolder, config);
		this.#addMainLightsGui(lightsFolder, config);
		this.#addStreetLightsGui(lightsFolder, config);
		this.#addBookStoreLightsGui(lightsFolder, config);
		this.#addStoreLightsGui(lightsFolder, config);
		this.#addForegroundLightsGui(lightsFolder, config);

		const windowsFolder = lightsFolder.addFolder('Windows');

		this.#addMainWindowsLightsGui(windowsFolder, config);
		this.#addBackgroundWindowsLightsGui(windowsFolder, config);

		windowsFolder.close();

		lightsFolder.add(config, 'lights.cars.intensity')
			.name('Cars lights')
			.min(0)
			.max(1)
			.step(0.01);
		lightsFolder.add(config, 'lights.plane.intensity')
			.name('Plane lights')
			.min(0)
			.max(1)
			.step(0.01);

		lightsFolder.close();
	}

	#addAmbientLightGui(folder, config) {
		const ambient = folder.addFolder('Ambient');

		ambient.add(config, 'lights.ambient.enabled')
			.name('enabled');

		ambient.addColor(config, 'lights.ambient.color')
			.name('color');

		ambient.add(config, 'lights.ambient.intensity')
			.name('intensity')
			.min(0)
			.max(8)
			.step(0.1);

		ambient.close();
	}

	#addBloomGui(folder, config) {
		const bloom = folder.addFolder('Bloom');

		bloom.add(config, 'bloom.intensity')
			.name('intensity')
			.min(0.0)
			.max(2.0)
			.step(0.01);

		bloom.add(config, 'bloom.threshold')
			.name('threshold')
			.min(0.0)
			.max(1.5)
			.step(0.001);

		bloom.close();
	}

	#addMainLightsGui(folder, config) {
		const main = folder.addFolder('Main');

		main.add(config, 'lights.main.enabled')
			.name('enabled');

		main.addColor(config, 'lights.main.color')
			.name('color');

		main.add(config, 'lights.main.intensity')
			.name('intensity')
			.min(0.0)
			.max(5.0)
			.step(0.01);

		main.close();
	}

	#addStreetLightsGui(folder, config) {
		const street = folder.addFolder('Street');

		street.add(config, 'lights.street.enabled')
			.name('enabled');

		street.addColor(config, 'lights.street.color')
			.name('color');

		street.add(config, 'lights.street.intensity')
			.name('intensity')
			.min(0.0)
			.max(5.0)
			.step(0.01);

		street.add(config, 'lights.street.decay')
			.name('decay')
			.min(0.0)
			.max(10.0)
			.step(0.1);

		street.close();
	}

	#addBookStoreLightsGui(folder, config) {
		const bookStore = folder.addFolder('BookStore');

		bookStore.add(config, 'lights.bookStore.enabled')
			.name('enabled');

		bookStore.addColor(config, 'lights.bookStore.color')
			.name('color');

		bookStore.add(config, 'lights.bookStore.intensity')
			.name('intensity')
			.min(0.0)
			.max(2.0)
			.step(0.01);

		bookStore.add(config, 'lights.bookStore.distance')
			.name('distance')
			.min(0.0)
			.max(5.0)
			.step(0.01);

		bookStore.close();
	}

	#addStoreLightsGui(folder, config) {
		const store = folder.addFolder('Store');

		store.add(config, 'lights.store.enabled')
			.name('enabled');

		store.addColor(config, 'lights.store.color')
			.name('color');

		store.add(config, 'lights.store.intensity')
			.name('intensity')
			.min(0.0)
			.max(2.0)
			.step(0.01);

		store.add(config, 'lights.store.distance')
			.name('distance')
			.min(0.0)
			.max(5.0)
			.step(0.01);

		store.close();
	}

	#addForegroundLightsGui(folder, config) {
		const foreground = folder.addFolder('Foreground');

		foreground.add(config, 'lights.fg.enabled')
			.name('enabled');

		foreground.addColor(config, 'lights.fg.color')
			.name('color');

		foreground.add(config, 'lights.fg.intensity')
			.name('intensity')
			.min(0.0)
			.max(50.0)
			.step(0.01);

		foreground.add(config, 'lights.fg.distance')
			.name('distance')
			.min(0.0)
			.max(5.0)
			.step(0.01);

		foreground.close();
	}

	#addMainWindowsLightsGui(folder, config) {
		const main = folder.addFolder('main');

		main.addColor(config, 'lights.windows.main.color')
			.name('color');

		main.add(config, 'lights.windows.main.intensity')
			.name('intensity')
			.min(0.0)
			.max(500.0)
			.step(0.01);

		main.close();
	}

	#addBackgroundWindowsLightsGui(folder, config) {
		const background = folder.addFolder('background');

		background.addColor(config, 'lights.windows.bg.color')
			.name('color');

		background.add(config, 'lights.windows.bg.intensity')
			.name('intensity')
			.min(0.0)
			.max(500.0)
			.step(5);

		background.close();
	}

	set(config) {
		if (!(config in CONFIGS)) {
			throw new TypeError(`Unknown config "${config}". Allowed: ${Object.keys(CONFIGS).join(', ')}`);
		}

		const previous = this.config;
		this.config = CONFIGS[config];

		if (previous === this.config){
			return;
		}

		this.emit('changed', this.config);
	}
}