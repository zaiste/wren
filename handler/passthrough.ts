import type { PlainHandler } from "../types.ts";

export const passthrough = (upstreamURL: string): PlainHandler => (request) => {
  const { body, headers, method } = request;

  // TODO pass all needed elements
  return fetch(upstreamURL, {
    method,
    headers,
    body
  })
}