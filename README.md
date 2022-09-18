# Wren

<img align="right" src="./static/wren.png" height="150px" alt="wren: a small, but powerful HTTP library for Deno & Deno Deploy">

**Wren** is a small, but powerful HTTP library for Deno & Deno Deploy, built for convenience and simplicity.

- convenient [aliases for HTTP responses](#aliases-for-http-responses)
- automatic [serialization of plain objects into JSON responses](#serialization-of-plain-objects-into-json-responses)
- optionally [typed JSON responses](#typed-json-responses) for additional checks
- built-in [router](#router) based on `URLPattern`
- out-of-the-box [parsing for request's body](#parsing-of-requests-body) (form & multipart)
- easily [composable middlewares](#composable-middlewares)
- [TypeScript types](#typescript-types) augmenting the HTTP experiences, e.g. `Middleware`, `Pipeline`, `RequestExtension`, `Route` et more

```ts
import { serve } from "wren/mod.ts";
import { GET, POST } from "wren/route.ts";
import * as Response from 'wren/response.ts';

const routes = [
  GET('/', () => Response.OK('Hello, Wren')),
  POST('/form-post', ({ params }) => 
    Response.Created(`Received: ${JSON.stringify(params)}`)),
];

serve(routes, { port: 3000 });
```

## Getting Started

```
deno run -A -r https://wren.deno.dev my-wren-project
```

```
cd my-wren-project
```

```
deno task start
```

## Features

### Aliases for HTTP Responses

Wren adds aliases for HTTP responses so that you can not only write them faster (less characters to write), but you use the actual HTTP status names and not the codes.

```tsx
// with Wren

import * as Response from 'wren/response.ts'; // don't forget to configure the import map for this to work

// ...somewhere in your handler (type: `Handler`)

return Response.OK('Your Body');
return Response.InternalServerError('Your Body');
return Response.MethodNotAllowed();

// without Wren

import { Status } from "http/http_status.ts"; // Deno's HTTP module

return new Response('Your body', { status: 200 });
return new Response('Your body', { status: Status.OK });

return new Response('Something bad ', { status: 500 });
return new Response('Something bad ', { status: Status.InternalServerError });

return new Response('', { status: 405 });
return new Response('', { status: Status.MethodNotAllowed });

// etc...
```

### Serialization of Plain Objects into JSON Responses

In addition to having less to write when using Wren's aliases for HTTP responses, you can also pass a plain JavaScript object directly to these alias functions, and it will be automatically serialized to a JSON response with the proper `Content-Type` headers (using Deno's `Response.json()` underneath)

```tsx
return Response.OK({ source: 'XYZ', message: 'Something went wrong', code: 1234 })
return Response.Created({ message: 'Widget created successfully', code: 777 })
```

### Typed JSON Responses

When you return plain JavaScript objects as the body of your responses, it would be great to have a way to define the shape of this data in order to avoid silly mistakes with typos or just to have a tighter interface between your API and its consumers. In Wren, responses can be *optionally* typed:

```tsx
interface ReturnPayload {
  source: string;
  message: string;
  code: number
}

return Response.OK<ReturnPayload>({ 
  source: 'XYZ',
  message: 'Something went wrong',
  code: 1234,
}); // this is OK

return Response.OK<ReturnPayload>({
  surce: 'XYZ', // squiggly lines for `surce` + autocomplete in your editor
  message: 'Something went wrong',
  code: 1234,
}); 
```

### Router 

Wren comes with a simple router built around the [URLPattern API](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern). It provides two methods: (1) `add` to register a handler for a specific HTTP method and pathname, and (2) `find` to retrieve a handler for given HTTP method and `Request`'s URL.

Wren builds on top of this `Router` to provide the `Routing` object in a form of a `Middleware` (more about middlewares in Wren below).

With `Routing` you can define your routing as an array of (potentially nested) `Route`s.

```tsx
import { serve } from "http/server.ts"; // Deno's HTTP server
import { GET, POST } from "wren/route.ts";
import { Routing } from "wren/routing.ts";
import * as Response from 'wren/response.ts';

const routes = [
  GET('/', () => Response.OK('Hello, Wren')),
  GET('/hello', () => Response.Accepted('Hello, again Wren')),
  POST('/form-post', ({ params }) =>
    Response.Created(`Received: ${JSON.stringify(params)}`)),
]

const routing = Routing(routes);
serve(routing, { port: 3000 });
```

Instead of using the `serve` function from Deno's standard library, you can swap it with the `serve` provided by Wren to pass the `routes` array directly.

```tsx
import { serve } from "wren/mod.ts";
import { GET, POST } from "wren/route.ts";
import * as Response from 'wren/response.ts';

const routes = [
  ...
];

serve(routes, { port: 3000 });
```

### Parsing of `Request`'s Body

Wren automatically parses the URL and the body (based on its `Content-Type`) of the incoming request to combine the search params, body params and path params into the additional `params` field of the request. 

Quick Reminder:
- search params come from the URL and are defined after the `?` sign with each separated by the `&` sign; e.g. `http://example.com?foo=1&bar=baz` will be transformed into `{ foo: 1, bar: 'baz' }` in Wren,
- body params are the fields sent in the request body and can come from the form submissions, JSON requests or as fields in `multipart`,
- path params are segments of the `pathname` designated as dynamic e.g. `/something/:name` will be transformed into `{ name: 'wren' }` in Wren when invoked as `/something/wren`,

For convenience, Wren combines all those params into a single, readily available object.

In addition to that, when you sent `multipart` requests, Wren also provides the uploaded files as the additional `files` field of the request.

```tsx
const handler: Handler = (request) => {
  const { params, files } = request;

  for (const file of files) {
    // iterate over files to process them or to save them on disk
  }

  return Response.OK(params)
}
```

The shape for both `params` and `files` is provided as an *intersection type* `RequestExtension` not to obscure the built-in Deno's `Request` as defined in the Fetch API.

### Composable Middlewares

In Wren middlewares are functions that take a handler as input and return a handler as output - as simple as that! :)

Thus, the `Middleware` type is defined as:

```ts
type Middleware = (handler: Handler) => Handler
```

(TBD soon. Check the source code or examples in the meantime)

### TypeScript Types

#### Middleware

TBD

#### Pipeline

`Pipeline` represents composition of a series of middlewares over a handler; thus:

```tsx
type Pipeline = [...Middleware[], Handler];
```

A pipeline is folded or composed in a single handler by applying each middleware onto another and finally on the last handler.

In Wren, middlewares can be defined globally (similar to the `.use` method in Express), but also locally, i.e. per particular route, which makes it much more flexible in practice than alternatives.

TDB

#### `RequestExtension`

`RequestExtension` defines `params` and `files` that are automatically extracted from the incoming request. This type is defined as an intersection type to the built-in `Request` type so it's less intrusive.

```tsx
type Handler = (request: Request & RequestExtension, connInfo: ConnInfo) => Response | Promise<Response>;
```

