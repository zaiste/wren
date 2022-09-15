import { serve } from 'wren/mod.ts';
import { GET } from 'wren/route.ts';
import * as Response from 'wren/response.ts';

import { renderToReadableStream as render } from "react-dom/server";

import Banner from './Banner.tsx';
import App from './App.tsx';

const routes = [
	GET('/', () => Response.OK('React.js How-To')), // implicit return
	GET('/jsx', async () => {
		return Response.HTML(await render(
			<App>
				<Banner />
			</App>,
		));
	}),
];

serve(routes, { port: 3000 });
