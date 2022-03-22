import http from "http";
import { Cookie } from "./Cookies";

class Request {
  private _IncomminMessage: http.IncomingMessage;
  public headers: http.IncomingHttpHeaders;
  public cookies: { [key: string]: string | Error };
  public body: any;
  public parameter: { [key: string]: string };
  public queryParameter: { [key: string]: string };
  public url: string;
  constructor(
    IncomingMessage: http.IncomingMessage,
    body: any,
    parameter: { [key: string]: string },
    queryParamater: { [key: string]: string }
  ) {
    this._IncomminMessage = IncomingMessage;
    this.headers = this._IncomminMessage.headers;
    this.cookies = Cookie.parse(this.headers);
    this.body = body;
    this.parameter = parameter;
    this.queryParameter = queryParamater;
    this.url = this._IncomminMessage.url || "";
  }
}

export { Request };
