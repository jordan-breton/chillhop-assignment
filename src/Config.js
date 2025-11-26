import EventEmitter from './utils/EventEmitter.js';

const CONFIGS = {
	night: {
		'bloom.intensity': 0.35,
		'bloom.threshold': 0,

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

		'water.glint.intensity': 1500,
		'water.glint.color': "#f8d5ae",
		'water.glint.size': 900,
	},
	sunrise: {
		'bloom.intensity': 0.35,
		'bloom.threshold': 0,

		'lights.main.enabled': true,
		'lights.main.color': '#213E50',
		'lights.main.intensity': 2,

		'lights.street.enabled': true,
		'lights.street.intensity': 1.0,
		'lights.street.color': "#8F564D",
		'lights.street.decay': 2.0,

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

		'lights.windows.bg.enabled': false,
		'lights.windows.bg.intensity': 125,
		'lights.windows.bg.color': '#985D55',

		'lights.cars.intensity': 1,
		'lights.plane.intensity': 1,

		'water.glint.intensity': 1500,
		'water.glint.color': "#f8d5ae",
		'water.glint.size': 900,
	},
	day: {
		'bloom.intensity': 0.35,
		'bloom.threshold': 0,

		'lights.main.enabled': true,
		'lights.main.color': '#213E50',
		'lights.main.intensity': 2,

		'lights.street.enabled': true,
		'lights.street.intensity': 1.0,
		'lights.street.color': "#8F564D",
		'lights.street.decay': 4.0,

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

		'lights.windows.bg.enabled': false,
		'lights.windows.bg.intensity': 125,
		'lights.windows.bg.color': '#985D55',

		'lights.cars.intensity': 1,
		'lights.plane.intensity': 1,

		'water.glint.intensity': 1500,
		'water.glint.color': "#f8d5ae",
		'water.glint.size': 900,
	}
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

		const folder = gui.addFolder('Ambience');

		Object.keys(CONFIGS).forEach((configName) => {
			folder.add(buttons, configName);
		});
	}

	#addConfigToGui(folder, config) {
		this.#addBloomGui(folder, config);
		this.#addLightsConfigToGui(folder, config);
		this.#addWaterConfigToGui(folder, config);

		folder.onChange(() => {
			if (this.config !== config) {
				return;
			}

			this.emit('changed', config);
		});
	}

	#addWaterConfigToGui(folder, config) {
		const water = folder.addFolder('Water');

		water.addColor(config, 'water.glint.color')
			.name('Glint color');

		water.add(config, 'water.glint.intensity')
			.name('Glint intensity')
			.min(0)
			.max(2500)
			.step(10);

		water.add(config, 'water.glint.size')
			.name('Glint size')
			.min(0)
			.max(2000)
			.step(10);

		water.close();
	}

	#addLightsConfigToGui(folder, config) {
		const lightsFolder = folder.addFolder('Lights');

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
			.max(10.0)
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
			.step(5);

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