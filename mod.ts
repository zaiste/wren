import { serve as upstreamServe, ServeInit } from 'http/server.ts';
import { Routing } from './routing.ts';
import { Routes } from './types.ts';

// FIXME as global middlewares as an array
export function serve(routes: Routes, options: ServeInit = {
	port: 5544,
}) {
	const routing = Routing(routes);
	return upstreamServe(routing, options);
}

export * from './types.ts';
