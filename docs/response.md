# Response

A webserver needs to be able to send responses. And exactly for that matter there
is the response object.

## send

This method is used to send the response back to the client.

```ts
Routes.get("/", (request, response) => {
  response.send("Hello World!");
});
```

## status

This is used to set the status code of the response. It's default value is 200,
except a route is hit that does not exists then it falls back to 404.

```ts
Routes.get("/", (request, response) => {
  response.status(203).send("Hello World!");
});
```

## cookies

This method is being used to set cookies. You can call this method multiple times
adding each cookie step by step or once passing in an object.

```ts
Routes.get("/", ({ request, response }) => {
  response
    .cookies({
      user: "some value",
    })
    .send("Hello World!");
});
```

## addHeader

This method is being used to set headers. You can call this method multiple times
adding each header step by step or once passing in an object.

```ts
Routes.get("/", ({ request, response }) => {
  response
    .addHeader({
      user: "some value",
    })
    .send("Hello World!");
});
```
