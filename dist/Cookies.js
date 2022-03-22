"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cookie = void 0;
const crypto_1 = __importDefault(require("crypto"));
class Cookies {
    constructor() {
        this._secret = "";
    }
    stringify(cookies) {
        let result = [];
        Object.entries(cookies).forEach((pair) => {
            if (this._secret === "") {
                result.push(pair.join("="));
            }
            else {
                let name = pair[0];
                let value = pair[1];
                let signature = crypto_1.default
                    .createHmac("SHA256", this._secret)
                    .update(`${value}`)
                    .digest("base64url");
                result.push(`${name}=${Buffer.from(value, "utf-8").toString("base64url")}.${signature}`);
            }
        });
        return {
            "Set-Cookie": result.join(";"),
        };
    }
    parse(headers) {
        let cookiesHeader = headers["cookie"];
        if (!cookiesHeader)
            return {};
        let pairs = cookiesHeader.split(";");
        let cookies = {};
        for (let pair of pairs) {
            let [key, value] = pair.split("=");
            if (this._secret === "") {
                cookies[key] = value;
            }
            else {
                let parts = value.split(".");
                if (parts.length !== 2) {
                    cookies[key] = new Error("Invalid cookie.");
                }
                else {
                    let [value, signature] = parts;
                    value = Buffer.from(value, "base64url").toString("utf-8");
                    let contestant = crypto_1.default
                        .createHmac("SHA256", this._secret)
                        .update(`${value}`)
                        .digest("base64url");
                    if (contestant !== signature) {
                        cookies[key] = new Error("Cookie has been manipulated.");
                    }
                    else {
                        cookies[key] = value;
                    }
                }
            }
        }
        return cookies;
    }
    setSigned(secret) {
        this._secret = secret;
    }
}
const Cookie = new Cookies();
exports.Cookie = Cookie;
