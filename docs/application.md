# Application

The application object is the server instance itself and it exposes it's functionality.
For example the exception system.

## on

This method allows you to define your own custom events to listen for but it
also gives you the power to overwrite existing listeners. The expected callback
can receive data. The data needs to be passed in everytime you emit that event.

```ts
Hephaestus.on("big screw up", (data) => {
  // do something
});
```

## emit

By calling emit you are emitting a custom event and if existing the corresponding
handler will be triggered.

```ts
Hephaestus.emit("big screw up", {});
```

## makeHttp

This method is used to create a https server. Calling `makeHttp` will overwrites
the automatically created http server with a https server that will listen on
port 443 after calling `listen`. A new http server will also be created. This server will listen on port
80 and redirects every request to the newly created https server.

```ts
import { Hephaestus } from "hephaestus";

Hephaestus.makeHttp({
  key: "",
  cert: "",
});

Hephaestus.listen();
```
