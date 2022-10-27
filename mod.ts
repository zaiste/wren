import type { DenoHandler, Routes } from './types.ts';

import { serve as upstreamServe, ServeInit } from 'http/server.ts';
import { Routing } from './routing.ts';

// FIXME as global middlewares as an array
export function serve(routes: Routes, options: ServeInit = {
	port: 5544,
}) {
	const routing = Routing(routes) as DenoHandler;
	return upstreamServe(routing, options);
}

export * from './types.ts';
