import http from "http";
import https from "https";
import { HttpVerb, Routes } from "./Routes";
import { parseBody } from "./Body";
import { Request } from "./Request";
import { Response } from "./Response";

class HephaestusServer {
  private _server: http.Server | https.Server;
  private _events: Map<string, (data: any) => void> = new Map();

  constructor() {
    this._server = http.createServer(async (request, response) => {
      await this._listener(request, response);
    });
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
      let { _url, query } = parseQuerystring(url);
      let { callback, parameter } = Routes.getCallback(_url, method);
      let _request = new Request(
        request,
        parseBody(body, request.headers["content-type"] || ""),
        parameter,
        query
      );
      let _response = new Response(response);
      callback({ request: _request, response: _response, application: this });
    });
  }

  public on(event: string, callback: () => void) {
    this._events.set(event, callback);
  }

  public emit(event: string, data: any) {
    let _event = this._events.get(event);
    if (_event) _event(data);
  }

  public listen(port = 80) {
    this._server?.listen(port);
  }

  public getServer() {
    return this._server;
  }
}

const parseQuerystring = (
  url: string
): { _url: string; query: { [key: string]: string } } => {
  let query = {};
  let [_url, querystring] = url.split("?");

  if (!querystring) {
    return { _url, query };
  }

  query = Object.fromEntries(
    querystring.split("&").map((pair) => pair.split("="))
  );

  return { _url, query };
};

const Hephaestus = new HephaestusServer();
export { Hephaestus, HephaestusServer };
