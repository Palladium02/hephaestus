/**
 * Copyright Sean Meyer 2022. All Rights Reserved.
 * Node module: hephaestus
 * This file is licensed under the MIT License.
 * License text available at https://opensource.org/license/MIT
 *
 * The following file contains the source code for the renewed cookie parser for the
 * Hephaestus framework.
 *
 * The CookieParser implements different public and private methods which will
 * be explained in the following section.
 *
 * serialize - cookies (Cookie[])
 *
 * "serialze" takes an array of cookies and creates an array of string representation
 * of said cookies.
 *
 *
 * _serializeOptions - options (CookieOptions)
 *
 * "_serializeOptions" will be called for every cookie that is being serialized as every cookie
 * can have it's own options. While serializing "_serializeOptions" is aware of certain restriction
 * when it comes to the values of certain options, e.g. Expires, HttpOnly and Secure.
 * As it is specified per HTTP standart dates passed as value for Expires have to match the UTC
 * time format and need to be measured in GMT.
 *
 *
 * _sign - value (string)
 *
 * "_sign" will also be called every cookie so that each value can be signed individually. This
 * method will also be called eventhough cookies should not be signed. "_sign" decides based on
 * wether the secret was set or not if a cookies needs to be signed or not. If not the unsigned
 * value is returned immediately.
 *
 *
 * parse - headers (http.IncommingHttpHeaders)
 *
 * "parse" will parse the value of the cookie field if not empty.
 * Cookies are send in the format cookie: "name=value;diffrentname=differentvalue".
 * While parsing "parse" will also take care of signed cookie values. In case the value
 * of a signed cookie's value being manipulated "parse" will detect that and replace the
 * value with an instance of Error.
 *
 *
 * setSigned - secret (string)
 *
 * "setSigned" is being used to the private property "_secret". After calling "setSigned" every
 * cookie will be signed.
 */

import http from "http";
import crypto from "crypto";

type Cookie = {
  name: string;
  value: string;
  options: CookieOptions;
};

type CookieOptions = {
  HttpOnly?: boolean;
  Expires?: string;
  Domain?: string;
  Path?: string;
  Secure?: boolean;
  "Max-Age"?: number;
  "Same-Site"?: SameSite;
};

type OptionNames = (keyof CookieOptions)[];

type SameSite = "Strict" | "Lax" | "None";

class CookieParser {
  private _secret: string = "";

  public serialize(cookies: Cookie[]) {
    let serializedCookies: string[] = [];
    cookies.forEach(({ name, value, options }) => {
      let serializedValue = `${name}=${this._sign(value)};`;
      let serializedOptions = this._serializeOptions(options);
      serializedCookies.push(`${serializedValue} ${serializedOptions}`);
    });

    return serializedCookies;
  }

  private _serializeOptions(options: CookieOptions) {
    let _options: string[] = [];
    let keys = Object.keys(options) as unknown as OptionNames;
    let regex = new RegExp(
      /(Mon|Tue|Wed|Thu|Fri|Sat|Sun){1}\,\s{1}\d{2}\s{1}(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec){1}\s{1}\d{4}\s{1}\d{2}\:\d{2}\:\d{2}\s[A-Z]+/gm
    );
    keys.forEach((option) => {
      if (option === "HttpOnly" || option === "Secure") {
        _options.push(option);
        return;
      }
      if (option === "Expires" && !regex.test(options[option]!)) {
        throw new TypeError("Date does not match UTC date format.");
      }
      _options.push(`${option}=${options[option]}`);
    });
    return _options.join("; ");
  }

  private _sign(value: string) {
    if (this._secret === "") return value;
    let signature = crypto
      .createHmac("SHA256", this._secret)
      .update(value)
      .digest("base64url");
    return `${Buffer.from(value, "utf-8").toString("base64url")}.${signature}`;
  }

  public parse(headers: http.IncomingHttpHeaders) {
    let cookiesHeader = headers["cookie"] as string;
    if (!cookiesHeader) return {};
    let pairs = cookiesHeader.split(";");
    let cookies: { [key: string]: string | Error } = {};
    for (let pair of pairs) {
      let [key, value] = pair.split("=");
      if (this._secret === "") {
        cookies[key] = value;
      } else {
        let parts = value.split(".");
        if (parts.length !== 2) {
          cookies[key] = new Error("Invalid cookie.");
        } else {
          let [value, signature] = parts;
          value = Buffer.from(value, "base64url").toString("utf-8");
          let contestant = crypto
            .createHmac("SHA256", this._secret)
            .update(`${value}`)
            .digest("base64url");
          if (contestant !== signature) {
            cookies[key] = new Error("Cookie has been manipulated.");
          } else {
            cookies[key] = value;
          }
        }
      }
    }
    return cookies;
  }

  public setSigned(secret: string) {
    this._secret = secret;
  }
}

const Cookies = new CookieParser();
export { Cookies, Cookie, CookieOptions };
