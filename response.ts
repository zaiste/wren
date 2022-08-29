import type { PlainObject } from "./types.ts";

function isPlainObject<T>(object: unknown): object is T {
  const prototype = Object.getPrototypeOf(object);
  return prototype === null || prototype.constructor === Object;
}

// 2xx
export const OK = <T = PlainObject>(body: BodyInit | T, headers = {}) => {
  const init = { status: 200, headers };
  return isPlainObject<T>(body) ? Response.json(body, init) : new Response(body, init);
}

export const Created = <T = PlainObject>(body: BodyInit | T = '', headers = {}) => {
  const init = { status: 201, headers };
  return isPlainObject<T>(body) ? Response.json(body, init) : new Response(body, init);
}

export const Accepted = (headers = {}) =>
  new Response('', { status: 202, headers });

export const NoContent = (headers = {}) =>
  new Response('', { status: 204, headers });

// 3xx
export const Redirect = (url: string, status = 302) =>
  Response.redirect(url, status)

// 4xx
export const BadRequest = <T = PlainObject>(body: BodyInit | T = '') => {
  const init = { status: 400 };
  return isPlainObject<T>(body) ? Response.json(body, init) : new Response(body, init);
}

export const Unauthorized = <T = PlainObject>(body: BodyInit | T = '') => {
  const init = { status: 401 };
  return isPlainObject<T>(body) ? Response.json(body, init) : new Response(body, init);
}

export const Forbidden = <T = PlainObject>(body: BodyInit | T = '') => {
  const init = { status: 403 };
  return isPlainObject<T>(body) ? Response.json(body, init) : new Response(body, init);
}

export const NotFound = (headers = {}) =>
  new Response('Not Found', { status: 404, headers });

export const MethodNotAllowed = () =>
  new Response('', { status: 405 });

export const NotAcceptable = () =>
  new Response('', { status: 406 });

export const Conflict = <T = PlainObject>(body: BodyInit | T = '') => {
  const init = { status: 409 };
  return isPlainObject<T>(body) ? Response.json(body, init) : new Response(body, init);
}

// 5xx
export const InternalServerError = <T = PlainObject>(body: BodyInit | T = '') => {
  const init = { status: 500 };
  return isPlainObject<T>(body) ? Response.json(body, init) : new Response(body, init);
}
