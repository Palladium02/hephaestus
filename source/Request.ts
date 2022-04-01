/**
 * Copyright Sean Meyer 2022. All Rights Reserved.
 * Node module: hephaestus
 * This file is licensed under the MIT License.
 * License text available at https://opensource.org/license/MIT
 *
 * The following file contains the source code for the request object for the
 * Hephaestus framework.
 *
 * The Request object only serves as container for diffrent properties that
 * should be available to the developer.
 */

import http from "http";
import { Cookies } from "./Cookies";

class Request {
  private _IncommingMessage: http.IncomingMessage;
  public headers: http.IncomingHttpHeaders;
  public cookies: { [key: string]: string | Error };
  public body: any;
  public params: { [key: string]: string };
  public query: { [key: string]: string };
  public url: string;
  constructor(
    IncomingMessage: http.IncomingMessage,
    body: any,
    parameter: { [key: string]: string },
    queryParameter: { [key: string]: string }
  ) {
    this._IncommingMessage = IncomingMessage;
    this.headers = this._IncommingMessage.headers;
    this.cookies = Cookies.parse(this.headers);
    this.body = body;
    this.params = parameter;
    this.query = queryParameter;
    this.url = this._IncommingMessage.url || "";
  }
}

export { Request };
