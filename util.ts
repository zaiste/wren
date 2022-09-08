import { Handler, HandlerMapping, Pipeline } from './types.ts';

export function isPlainObject<T>(object: unknown): object is T {
	const prototype = Object.getPrototypeOf(object);
	return prototype === null || prototype.constructor === Object;
}

export const isFunction = (value: unknown) => {
	return !!value &&
		(Object.prototype.toString.call(value) === '[object Function]' ||
			'function' === typeof value || value instanceof Function);
};

export function isPipeline(
	handler: Handler | HandlerMapping | Pipeline,
): handler is Pipeline {
	return Array.isArray(handler);
}

export function isHandlerMapping(
	handler: Handler | HandlerMapping | Pipeline,
): handler is HandlerMapping {
	return isPlainObject<HandlerMapping>(handler);
}

export function isHandler(
	handler: Handler | HandlerMapping | Pipeline,
): handler is Handler {
	return isFunction(handler);
}
