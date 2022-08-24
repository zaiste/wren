function isPlainObject(object: unknown): object is Record<string, unknown> {
  const prototype = Object.getPrototypeOf(object);
  return prototype === null || prototype.constructor === Object;

}

// 2xx
export const OK = (body: BodyInit | Record<string, unknown>, headers = {}) => {
  const init = { status: 200, headers };

  if (isPlainObject(body)) {
    return Response.json(body, init)
  } else {
    return new Response(body, init);
  }
}

export const Created = (body: BodyInit = '', headers = {}) =>
  new Response(body, { status: 201, headers });

export const Accepted = (headers = {}) =>
  new Response('', { status: 202, headers });

export const NoContent = (headers = {}) =>
  new Response('', { status: 204, headers });

// 3xx
export const Redirect = (url: string, status = 302) =>
  Response.redirect(url, status)

// 4xx
export const BadRequest = (body: BodyInit = '') =>
  new Response(body, { status: 400 });

export const Unauthorized = (body: BodyInit = '') =>
  new Response(body, { status: 401 });

export const Forbidden = (body: BodyInit = '') =>
  new Response(body, { status: 403 });

export const NotFound = (headers = {}) =>
  new Response('Not Found', { status: 404, headers });

export const MethodNotAllowed = () =>
  new Response('', { status: 405 });

export const NotAcceptable = () =>
  new Response('', { status: 406 });

export const Conflict = (body: BodyInit = '') =>
  new Response(body, { status: 409 });

// 5xx
export const InternalServerError = (body: BodyInit = '') =>
  new Response(body, { status: 409 });


