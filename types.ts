import type { ConnInfo } from 'http/server.ts';

export type PlainObject = Record<string, unknown>;

export interface RequestExtension<P = Params> {
	params: P;
	files?: {
		[name: string]: File;
	};
}

export type Handler = (
	request: Request & RequestExtension,
	connInfo: ConnInfo,
) => Response | Promise<Response>;

export interface Meta {
	summary?: string;
	description?: string;
	parameters?: Array<unknown>;
	responses?: Record<string, unknown>;
}
export type Middleware = (handler: Handler) => Handler;
export type MaybePromise<T> = T | Promise<T> | PromiseLike<T>;
export type Pipeline = [...Middleware[], Handler];
export type ReversedPipeline = [Handler, ...Middleware[]];
export interface RoutePaths {
	[name: string]: any;
}
export interface RouteOptions {
	middleware?: Middleware[];
	meta?: Meta;
}
export interface HandlerMapping {
	GET?: Handler;
	POST?: Handler;
	PUT?: Handler;
	PATCH?: Handler;
	DELETE?: Handler;
	middleware?: Middleware[];
	meta?: Meta;
}

export type Route = [string, HandlerMapping | Handler | Pipeline, Route?];
export type Routes = Route[];

export const HTTPMethod = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	PATH: 'PATCH',
	HEAD: 'HEAD',
	OPTIONS: 'OPTIONS',
	DELETE: 'DELETE',
} as const;
export type HTTPMethod = typeof HTTPMethod[keyof typeof HTTPMethod];

export interface HandlerParams {
	handler: Handler;
	names: string[];
}

export interface HandlerParamsMap {
	[method: string]: HandlerParams;
}

export interface Params {
	[name: string]: unknown;
}

export interface KeyValue {
	name: string;
	value: string;
}
