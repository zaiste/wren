import { Handler } from './types.ts';

interface HandlerMatch {
	pattern: URLPattern;
	handler: Handler;
}

type MatchResponse = false | {
	handler: Handler;
	params: Record<string, string>;
};

export class Router {
	#routes: Record<string, HandlerMatch[]> = {
		ANY: [],
		GET: [],
		HEAD: [],
		PATCH: [],
		POST: [],
		PUT: [],
		DELETE: [],
	};

	add(method: string, pathname: string, handler: Handler) {
		this.#routes[method].push({
			pattern: new URLPattern({ pathname }),
			handler,
		});
	}

	find(method: string, url: string): MatchResponse {
		for (const r of this.#routes[method]) {
			if (r.pattern.test(url)) {
				const pathParams = r.pattern.exec(url)!.pathname.groups;
				return { handler: r.handler, params: pathParams };
			}
		}

		return false;
	}
}
