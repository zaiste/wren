import type { ConnInfo, Handler as OrigHandler } from 'http/server.ts';
import { Handler, Middleware, Params, Pipeline, RequestExtension, Routes } from './types.ts';

import { Router } from './router.ts';
import { HTTPMethod } from './types.ts';
import { isHandler, isHandlerMapping, isPipeline } from './util.ts';

const compose = <T extends CallableFunction, U>(...functions: T[]) => (args: U) =>
	functions.reduceRight((arg, fn) => fn(arg), args);

const inferRequestValueType = (v: string): string | number | boolean => {
	if (v === '') {
		return true;
	} else if (v === 'true') {
		return true;
	} else if (v === 'false') {
		return false;
	} else if (!isNaN(Number(v))) {
		return +v;
	}
	return v;
};

const parseBody = async (request: Request) => {
	const { headers } = request;

	const buffer = request.body;

	if (!buffer) {
		return { params: {}, files: {} };
	}

	const contentType = headers.get('Content-Type')?.split(';')[0];

	switch (contentType) {
		case 'application/x-www-form-urlencoded': {
			const form = await request.formData();
			const params: Params = {};
			for (const [key, value] of form) {
				params[key] = inferRequestValueType(value as string);
			}
			return { params, files: {} };
		}
		case 'application/json': {
			const params = await request.json();
			return { params, files: {} };
		}
		case 'multipart/form-data': {
			const form = await request.formData();

			const params: Params = {};
			const files: Record<string, File> = {};
			for (const [key, value] of form) {
				if (value instanceof File) {
					// TODO add mimetype? encoding?
					files[key] = value;
				} else {
					params[key] = value;
				}
			}

			return { params, files };
		}
		default:
			return { params: {}, files: {} };
	}
};

const RouteFinder = (router: Router): Middleware => {
	return (nextHandler: Handler) =>
	async (
		request: Request & RequestExtension,
		connInfo: ConnInfo,
	) => {
		const { method, url } = request;
		const data = router.find(method, url) || router.find('ANY', url);

		if (data) {
			const { handler: foundHandler, params: pathParams } = data;

			const queryParams: Params = {};
			const { searchParams } = new URL(url);
			for (const [key, value] of searchParams) {
				queryParams[key] = inferRequestValueType(value);
			}

			const { files, params: bodyParams } = await parseBody(request);

			request.params = { ...queryParams, ...pathParams, ...bodyParams };
			request.files = files;

			return await foundHandler(request, connInfo);
		} else {
			return nextHandler(request, connInfo);
		}
	};
};

export const Routing = (routes: Routes = []): OrigHandler => {
	const router = new Router();
	const middlewares: Array<Middleware> = [];

	const add = (
		method: HTTPMethod | 'ANY',
		path: string,
		...fns: [...Middleware[], Handler]
	) => {
		const action = fns.pop() as Handler;

		// pipeline is a handler composed over middlewares,
		// `action` function must be explicitly extracted from the pipeline
		// as it has different signature, thus cannot be composed
		const pipeline: Handler = fns.length === 0
			? action
			: compose(...(fns as Middleware[]))(action) as Handler;

		router.add(method.toUpperCase(), path, pipeline);
	};

	for (const [path, unit] of routes) {
		if (isHandlerMapping(unit)) {
			const { middleware = [] } = unit;

			for (const [method, handler] of Object.entries(unit)) {
				if (method in HTTPMethod) {
					const flow: Pipeline = [...middleware, handler as Handler];
					add(method as HTTPMethod, path, ...flow);
				}
				// else: a key name undefined in the spec -> discarding
			}

			continue;
		}

		if (isPipeline(unit)) {
			add('ANY', path, ...unit);
			continue;
		}

		if (isHandler(unit)) {
			add('ANY', path, unit);
			continue;
		}
	}

	const pipeline = compose<Middleware, Handler>(
		...middlewares,
		RouteFinder(router),
	)(
		// (_) => Response.NotFound()
		(_) => new Response('Not Found', { status: 404 }),
	);

	return (request: Request, connInfo: ConnInfo) => {
		// TODO ask Michal
		(request as Request & RequestExtension).params = {};

		return pipeline(request as Request & RequestExtension, connInfo);
		// .then(handle(context))
		// .catch(this.handleError(context));
	};
};
