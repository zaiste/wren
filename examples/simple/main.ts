import { serve } from 'wren/mod.ts';
import { GET, POST } from 'wren/route.ts';
import { Routing } from 'wren/routing.ts';
import * as Response from 'wren/response.ts';

const routes = [
	GET('/', () => Response.OK('Hello, Root')),
	POST('/form-post', (request) => {
		return Response.Created('Hello, Root');
	}),
	GET('/json-post', () => {
		return Response.Created('Hello JSON');
	}),
];

// const routing = Routing(routes);

serve(routes, { port: 3000 });
