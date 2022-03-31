import http from "http";
import { Cookies, Cookie, CookieOptions } from "./Cookies";

class Response {
  private _response: http.ServerResponse;
  private _headers: { [key: string]: any };
  private _cookies: Cookie[];
  private _status: number;
  constructor(response: http.ServerResponse) {
    this._response = response;
    this._headers = {};
    this._cookies = [];
    this._status = 200;
  }

  addHeader(name: string, value: any): this;
  addHeader(headers: { [key: string]: any }): this;

  addHeader(singleOrMultiple: string | { [key: string]: any }, value?: any) {
    if (typeof singleOrMultiple === "string") {
      this._headers = {
        ...this._headers,
        [singleOrMultiple]: value,
      };
      return this;
    }
    this._headers = {
      ...this._headers,
      ...singleOrMultiple,
    };
    return this;
  }

  cookie(name: string, value: string, options: CookieOptions) {
    this._cookies.push({
      name,
      value,
      options,
    });
    return this;
  }

  status(code: number) {
    this._status = code;
    return this;
  }

  public send(data: any) {
    this._headers = {
      ...this._headers,
      "Set-Cookie": Cookies.serialize(this._cookies),
    };
    this._response.writeHead(this._status, this._headers);
    this._response.write(data);
    this._response.end();
  }
}

export { Response };
