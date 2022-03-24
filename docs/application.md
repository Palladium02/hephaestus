# Application

The application object is the server instance itself and it exposes it's functionality.
For example the exception system.

## exeption

This method allows you to define your own custom exeption to listen for but it
also gives you the power to overwrite existing listeners. The expected callback
can receive data about the reason for the exception. The data needs to be passed
in everytime you throw that exception.

```ts
Hephaestus.exception("big screw up", (data) => {
  // do something
});
```

## throw

By calling throw your are throwing a custom exception and if existing the corresponding
handler will be triggered.

```ts
Hephaestus.throw("big screw up", {});
```
