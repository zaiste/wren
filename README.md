# Wren

<img align="right" src="./static/wren.png" height="150px" alt="wren: a small, but powerful HTTP library for Deno & Deno Deploy">

**Wren** is a small, but powerful HTTP library for Deno & Deno Deploy, built for convenience and simplicity.

- convenient aliases for HTTP responses
- JSON responses for plain objects
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

