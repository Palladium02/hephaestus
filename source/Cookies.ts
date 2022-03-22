import http from "http";
import crypto from "crypto";

class Cookies {
  private _secret: string;
  constructor() {
    this._secret = "";
  }

  stringify(cookies: { [key: string]: string }) {
    let result: string[] = [];
    Object.entries(cookies).forEach((pair) => {
      if (this._secret === "") {
        result.push(pair.join("="));
      } else {
        let name = pair[0];
        let value = pair[1];
        let signature = crypto
          .createHmac("SHA256", this._secret)
          .update(`${value}`)
          .digest("base64url");
        result.push(
          `${name}=${Buffer.from(value, "utf-8").toString(
            "base64url"
          )}.${signature}`
        );
      }
    });
    return {
      "Set-Cookie": result.join(";"),
    };
  }

  parse(headers: http.IncomingHttpHeaders) {
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

  setSigned(secret: string) {
    this._secret = secret;
  }
}

const Cookie = new Cookies();
export { Cookie };
