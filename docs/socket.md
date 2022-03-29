# Sockets with Hephaestus

Sockets are a way for realtime communication between client and server.
Hephaestus does not implement it's own sockets but it easily integrates with
`socket.io`.

```ts
import { Hephaestus } from "hephaestus";
import { Server } from "socket.io";

const io = new Server(Hephaestus.getServer());

io.on("connection", (socket) => {
  // your socket logic goes here
});

Hephaestus.listen();
```
