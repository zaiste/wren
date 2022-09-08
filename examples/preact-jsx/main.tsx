import { serve } from 'wren/mod.ts';
import { GET } from 'wren/route.ts';
import * as Response from 'wren/response.ts';
import render from 'preact-render-to-string';

import Banner from './Banner.tsx';
import App from './App.tsx';

const routes = [
	GET('/', () => Response.OK('JSX How-To')), // implicit return
	GET('/jsx', () => {
		return Response.HTML(render(
			<App>
				<Banner />
			</App>,
		));
	}),
];

serve(routes, { port: 3000 });
