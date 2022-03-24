import http from "http";
import { Cookie } from "./Cookies";

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
    this.cookies = Cookie.parse(this.headers);
    this.body = body;
    this.params = parameter;
    this.query = queryParameter;
    this.url = this._IncommingMessage.url || "";
  }
}

export { Request };
