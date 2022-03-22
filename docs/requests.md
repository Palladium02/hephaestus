# Requests

Everytime a user makes a request to your server a request object will be created.
This request object holds the most important information you need as a developer.
For example the headers, the body and much more.

## URL

Available through `request.url`. Gives you access to the url that was requested.

## Parameter

Available through `request.parameter`. Gives you access to route parameters.
For example you have a route definition as follows and a request that send to
`/users/1`

```ts
Routes.get("/users/:id", (request, _) => {
  console.log(request.parameter.id); // will log "1"
});
```

## Header

Available through `request.headers`. Gives you access to the request headers.

## Body

Available through `request.body`. Gives you access to the request body.
Hephaestus currently supports four different content type out of the box.
These are `text/plain`, `application/json`, `application/x-www-form-urlencoded`
and `multipart/formdata`. Everything else will result in the request body being
equal to an array of buffers (the received chunks of data).

## Cookies

Available through `request.cookies`. Gives you access to the cookies send to the
server. You can read more about cookies [here](https://github.com/Palladium02/hephaestus/blob/main/docs/cookies.md).
