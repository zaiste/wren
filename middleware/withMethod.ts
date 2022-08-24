import * as Response from 'wren/response.ts';
import { HTTPMethod, Middleware } from "wren/types.ts";

export const withMethod = (...methods: HTTPMethod[]): Middleware => (handler) => async (request, connInfo) => {
  const { method } = request;

  if (!methods.includes(method as HTTPMethod)) {
    return Response.MethodNotAllowed();
  }

  const response = await handler(request, connInfo);

  return response;
};
