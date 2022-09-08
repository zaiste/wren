import * as Response from '../response.ts';
import { HTTPMethod, Middleware } from '../types.ts';

export const AllowedHTTPMethod =
	(...methods: HTTPMethod[]): Middleware => (handler) => async (request, connInfo) => {
		const { method } = request;

		if (!methods.includes(method as HTTPMethod)) {
			return Response.MethodNotAllowed();
		}

		const response = await handler(request, connInfo);

		return response;
	};
