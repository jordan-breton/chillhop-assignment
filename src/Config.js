import EventEmitter from './utils/EventEmitter.js';

const CONFIGS = {

};

export default class Config extends EventEmitter {
	constructor(defaultConfig = 'night') {
		super();

		if (!('night' in CONFIGS)) {
			throw new TypeError(`Unknown config "${defaultConfig}". Allowed: ${Object.keys(CONFIGS).join(', ')}`);
		}
	}

	get() {
		return this.config;
	}
}