/**
 * Copyright Sean Meyer 2022. All Rights Reserved.
 * Node module: hephaestus
 * This file is licensed under the MIT License.
 * License text available at https://opensource.org/license/MIT
 *
 * The following file contains the source code for the response object for the
 * Hephaestus framework.
 *
 * The Response object implements different public and private methods which will
 * be explained in the following section.
 *
 * addHeader - name (string), value (string) or singleOrMultiple (object)
 *
 * "addHeader" depending on the chosen overload adds one or multiple headers to
 * the private "_headers" property as headers will be collected during the handling
 * process of the request. The headers will be written only once when "send" was
 * called to prevent weird behavior.
 *
 *
 * cookie - name (string), value (string), options (CookieOptions)
 *
 * "cookie" allows the user to add one cookie at a time to the private "_cookies"
 * property, the same reason as stated above applies here but they also need to
 * be serialized before being added to the response headers.
 *
 *
 * status - code (number)
 *
 * "status" is used to set the private "_status" property.
 *
 *
 * send - data (any)
 *
 * "send" is the method where all loose end connect. The headers and cookies
 * will be merged and the response payload is written to the response.
 * Finally the response is being send.
 */

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
