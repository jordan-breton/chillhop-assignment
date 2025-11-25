export default class EventEmitter extends EventTarget {
	emit(event, data) {
		this.dispatchEvent(new CustomEvent(event, { detail: data }));
	}

	on(event, callback) {
		this.addEventListener(event, callback);
	}

	once(event, callback) {
		this.addEventListener(event, callback, { once: true });
	}
}