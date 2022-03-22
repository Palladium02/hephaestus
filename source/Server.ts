import http from "http";
import https from "https";
import { HttpVerb, Routes } from "./Routes";
import { parseBody } from "./Body";
import { Request } from "./Request";
import { Response } from "./Response";

type EventNames = "boot" | "booted" | "config";

class Hephaestus {
  private _server: http.Server | https.Server | null;
  private _events: { [key in EventNames]: () => void } = {
    boot: () => {},
    booted: () => {},
    config: () => {},
  };

  constructor() {
    this._server = null;
  }

  private async _listener(
    request: http.IncomingMessage,
    response: http.ServerResponse
  ) {
    let body: any[] = [];
    let method = (request?.method?.toUpperCase() || "GET") as HttpVerb;
    let url = request?.url || "/";

    request.on("data", (chunk) => {
      body.push(chunk);
    });

    request.on("end", () => {
      // let [uri , querystring] = url.split("?") | ["", ""];
      // TODO: parse query parameters like /?test=test
      let { callback, parameter, error } = Routes.getCallback(url, method);
      let _request = new Request(
        request,
        parseBody(body, request.headers["content-type"] || ""),
        parameter
      );
      let _response = new Response(response);
      callback(_request, _response);
    });
  }

  public on(event: EventNames, callback: () => void) {
    this._events[event] = callback;
  }

  public async boot(port: number = 80) {
    // let config = await import(`${this._rootDir}\\.rapidrc.js`);

    // this._events.config();
    // config?.routes.forEach(async (route: string) => {
    //   await import(`${this._rootDir + route}`);
    // });

    this._events.boot();
    this._server = http.createServer(async (request, response) => {
      await this._listener(request, response);
    });

    this._server.listen(port);
    this._events.booted();
  }
}

export { Hephaestus };
