import { serve } from 'wren/mod.ts';
import { GET, POST } from 'wren/route.ts';
import * as Response from 'wren/response.ts';

const routes = [
	GET('/', () => Response.OK('Hello, Root')),
	POST('/form-post', ({ params }) => {
		return Response.Created(`POST with: ${JSON.stringify(params, null, 2)}`);
	}),
	GET('/json', () => {
		return Response.Created({
			foo: 1,
			bar: 'baz',
			else: {
				bim: 1234
			}
		});
	}),
];

serve(routes, { port: 3000 });
