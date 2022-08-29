# Wren

<img align="right" src="./static/wren.png" height="150px" alt="wren: a small, but powerful HTTP library for Deno & Deno Deploy">

**Wren** is a small, but powerful HTTP library for Deno & Deno Deploy, built for convenience and simplicity.

- convenient [aliases for HTTP responses](#aliases-for-http-responses)
- JSON responses for plain objects
- optionally typed JSON responses for additional checks
- built-in router based on `URLPattern`
- out-of-the-box parsing for request's body (form & multipart) 
- TypeScript types augmenting the HTTP experiences, e.g. `Middleware`, `Pipeline`, `RequestExtension`
- easily composable middlewares


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

## Features

### Aliases for HTTP Responses

Wren adds aliases for HTTP responses so that you can not only write them faster (less characters to write), but you use the actual HTTP status names and not the codes.

```tsx
// without Wren

return new Response('Your body', { status: 200 });
return new Response('Your body', { status: Status.OK });

return new Response('Something bad ', { status: 500 });
return new Response('Something bad ', { status: Status.InternalServerError });

return new Response('', { status: 405 });
return new Response('', { status: Status.MethodNotAllowed });

// ---

import * as Response from 'wren/response.ts'; // don't forget to configure the import map for this to work

// with Wren

return Response.OK('Your Body');
return Response.InternalServerError('Your Body');
return Response.MethodNotAllowed();

// etc...
```
