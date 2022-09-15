import {
	Handler,
	HTTPMethod,
	Meta,
	Middleware,
	Pipeline,
	Route,
	RouteOptions,
} from './types.ts';

import { isPipeline } from './util.ts'

function makeRoute(
	name: HTTPMethod,
	path: string,
	handler: Handler | Pipeline,
	middleware: Middleware[],
	meta: Meta,
): Route {
	if (isPipeline(handler)) {
		const h = handler.pop() as Handler;
		return [
			path,
			{
				[name]: h,
				middleware: [...middleware, ...(handler as Middleware[])],
				meta,
			},
		];
	} else {
		return [path, { [name]: handler, middleware, meta }];
	}
}

export function GET(
	path: string,
	handler: Handler | Pipeline,
	{ middleware = [], meta = {} }: RouteOptions = {},
): Route {
	return makeRoute('GET', path, handler, middleware, meta);
}

export function POST(
	path: string,
	handler: Handler | Pipeline,
	{ middleware = [], meta = {} }: RouteOptions = {},
): Route {
	return makeRoute('POST', path, handler, middleware, meta);
}

export function PATCH(
	path: string,
	handler: Handler | Pipeline,
	{ middleware = [], meta = {} }: RouteOptions = {},
): Route {
	return makeRoute('PATCH', path, handler, middleware, meta);
}

export function PUT(
	path: string,
	handler: Handler | Pipeline,
	{ middleware = [], meta = {} }: RouteOptions = {},
): Route {
	return makeRoute('PUT', path, handler, middleware, meta);
}

export function DELETE(
	path: string,
	handler: Handler | Pipeline,
	{ middleware = [], meta = {} }: RouteOptions = {},
): Route {
	return makeRoute('DELETE', path, handler, middleware, meta);
}
