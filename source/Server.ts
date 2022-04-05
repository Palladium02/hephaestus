/**
 * Copyright Sean Meyer 2022. All Rights Reserved.
 * Node module: hephaestus
 * This file is licensed under the MIT License.
 * License text available at https://opensource.org/license/MIT
 *
 * The following file contains the source code for the Hephaestus server for the
 * Hephaestus framework.
 *
 * The HephaestusServer object implements different public and private methods which will
 * be explained in the following section.
 *
 * _listener - request (http.IncommingMessage), response (http.ServerResponse)
 *
 * "_listener" is a method that will be called every time a new request comes in.
 * In this method everything is being put together, e.g. getting the body or invoking
 * the querystring parser.
 *
 *
 * on - event (string), callback ((data: any) => void)
 *
 * "on" can be used to add events to the HephaestusServer instance. This is achieved
 * by mapping an event name and a callback, that mapping will be stored in the
 * private "_events" property.
 *
 *
 * emit - event (string), data (any)
 *
 * "emit" is used to retrieve a certain callback mapped to the given event.
 *
 *
 * listen - port? (number)
 *
 * "listen" is being used to ultimately start the server. Under the hood there is
 * more than just calling the http.Server.listen method. "listen" checks wether a
 * port was given and if not if the server was set to http or https. Based on that
 * the server will then be started on the standard port for http (80) or https (443).
 *
 *
 * getServer
 *
 * The purpose of "getServer" is to expose the private "_server" property. This
 * can be used to add "socket.io" to the developers project.
 *
 *
 * makeHttps - options (object)
 *
 * "makeHttps" is used to create an https server. It will overwrite the default
 * http server with an https server. It will also create a new http server that
 * will redirect every request to the https server with a code of 301.
 */

import http from "http";
import https from "https";
import { HttpVerb, Routes } from "./Routes";
import { parseBody } from "./Body";
import { Request } from "./Request";
import { Response } from "./Response";

class HephaestusServer {
  private _server: http.Server | https.Server;
  private _httpRedirect: http.Server | null = null;
  private _isHttps: boolean = false;
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

  public on(event: string, callback: (data: any) => void) {
    this._events.set(event, callback);
  }

  public emit(event: string, data: any) {
    let _event = this._events.get(event);
    if (_event) _event(data);
  }

  public listen(port?: number) {
    if (port) {
      this._server.listen(port);
    } else {
      this._isHttps ? this._server.listen(443) : this._server.listen(80);
    }
    this.emit("started", { date: Date.now() });
  }

  public getServer() {
    return this._server;
  }

  public makeHttps(options: { [key in "key" | "cert"]: string }) {
    this._isHttps = true;
    this._server.close();
    this._server = https.createServer(options, async (request, response) => {
      await this._listener(request, response);
    });
    // .listen(443);
    this._httpRedirect = http
      .createServer((request, response) => {
        let url = request.url;
        response.writeHead(301, {
          location: url,
        });
        response.end();
      })
      .listen(80);
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
