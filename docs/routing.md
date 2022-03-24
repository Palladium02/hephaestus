# Routing with Hephaestus

To allow your users to visit different pages you need to have different routes.
You can use the `Routes` instance to create mappings between a route and
a function that will be called when that specific route is triggered.

```ts
import { Routes } from "hephaestus";

Routes.get("/", (request, response) => {
  response.status(200).send("Hello World!");
});
```

You can define routes where ever you want. If you do not define your routes in
the entry point file you need to import the route file(s) into it.

```ts
import { Hephaestus } from "hephaestus";
import "./routes.ts";

const hephaestus = new Hephaestus();

hephaestus.boot();
```

## HTTP methods

Hephaestus has shorthand methods for every HTTP method.

### GET

```ts
Routes.get("/", async () => {});
```

### POST

```ts
Routes.post("/", async () => {});
```

### PUT

```ts
Routes.put("/", async () => {});
```

### NOT_FOUND

`NOT_FOUND` is not really a HTTP method but it allows you to define custom
behavior for an not found route.

```ts
Routes.notFound(async () => {});
```

Each callback has to takes one parameter the HttpContract containing the [request](https://github.com/Palladium02/hephaestus/blob/main/docs/requests.md)
and [response](https://github.com/Palladium02/hephaestus/blob/main/docs/response.md) object and
also the application itself.

## Route parameter

With route parameters you can register dynamic routes.
<br>
When adding a parameter prefix it with a `:`.

```ts
Routes.get("/:id", ({ request, response }) => {
  /**
   * GET /1 HTTP/1.1 will result in
   * request.params.id => "1"
   */
});
```

You are not limited to registering only one route parameter. You can register
as many as you like.

## Queryparameter

Queryparameter are another way to pass data to the server. These parameters will
be parsed by the server and the values will be available to you.
The queryparameter are available through the `.query` property on the request
object.
