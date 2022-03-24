# Hephaestus

### Table of contents

- [Introduction](#introduction)
- [Requirements](#requirements)
- [Installation](#installation)
- [Basic how to's](#basic-how-tos)

## Introduction

What is Hephaestus? Apart from being the greek god of blacksmiths, Hephaestus
also is a small (13kB) library for creating webserver.
<br>
The following README you will try to teach you the basics of this library but
if you are interested behind almost every subheading is a link to a more in depth
explanation of the given topic.
[This](https://github.com/Palladium02/hephaestus/blob/main/docs/index.md) will bring you to the start of the journey.

## Requirements

All you need is a working installation of NodeJS with a version of at least
10.0.0. To check which version you are running simply run from your terminal.

```
node -v
```

But we recommend using typescript with this library.

## Installation

using npm

```
npm install https://github.com/palladium02/hephaestus.git
```

using yarn

```
yarn add https://github.com/palladium02/hephaestus.git
```

In case you want to use typescript with Hephaestus there is no need to worry as
Hephaestus ships with built-in type declarations.

## Basic how to's

### The entry point

The following snippet shows you how to create a Hephaestus instance and how
to start the server. The server starts on port 80 by default. You can change that
behavior by passing in a valid port into the boot method.

```ts
import { Hephaestus } from "hephaestus";

Hephaestus.boot();
```

### [Routes](https://github.com/Palladium02/hephaestus/blob/main/docs/routing.md)

To allow your users to visit different pages you need to have different routes.
You can use the `Routes` instance to create mappings between a route and
a function that will be called when that specific route is triggered.

```ts
import { Routes } from "hephaestus";

Routes.get("/", ({ request, response }) => {
  response.status(200).send("Hello World!");
});
```

You can define routes where ever you want. If you do not define your routes in
the entry point file you need to import the route file(s) into it.

```ts
import { Hephaestus } from "hephaestus";
import "./routes.ts";

Hephaestus.boot();
```

### [Request](https://github.com/Palladium02/hephaestus/blob/main/docs/requests.md)

Every time a user makes a request to your server a request object will be created.
This request object holds the most important information you need as a developer.
For example the headers, the body and much more.

### [Response](https://github.com/Palladium02/hephaestus/blob/main/docs/response.md)

A webserver needs to be able to send responses. And exactly for that matter there
is the response object.

### [Application](https://github.com/Palladium02/hephaestus/blob/main/docs/application.md)

The application object is the server instance itself and it exposes it's functionality.
For example the exception system.
