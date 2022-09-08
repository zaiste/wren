import { serve as upstreamServe, ServeInit } from 'http/server.ts';
import { Routing } from './routing.ts';
import { Routes } from './types.ts';

// FIXME as global middlewares as an array
export function serve(routes: Routes, options: ServeInit = {}) {
	const routing = Routing(routes);
	return upstreamServe(routing, options);
}
