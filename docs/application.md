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
