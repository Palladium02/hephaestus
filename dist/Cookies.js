"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cookies = void 0;
const crypto_1 = __importDefault(require("crypto"));
class CookieParser {
    constructor() {
        this._secret = "";
    }
    serialize(cookies) {
        let serializedCookies = [];
        cookies.forEach(({ name, value, options }) => {
            let serializedValue = `${name}=${this._sign(value)};`;
            let serializedOptions = this._serializeOptions(options);
            serializedCookies.push(`${serializedValue} ${serializedOptions}`);
        });
        return serializedCookies;
    }
    _serializeOptions(options) {
        let _options = [];
        let keys = Object.keys(options);
        let regex = new RegExp(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun){1}\,\s{1}\d{2}\s{1}(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec){1}\s{1}\d{4}\s{1}\d{2}\:\d{2}\:\d{2}\s[A-Z]+/gm);
        keys.forEach((option) => {
            if (option === "HttpOnly" || option === "Secure") {
                _options.push(option);
                return;
            }
            if (option === "Expires" && !regex.test(options[option])) {
                throw new TypeError("Date does not match UTC date format.");
            }
            _options.push(`${option}=${options[option]}`);
        });
        return _options.join("; ");
    }
    _sign(value) {
        if (this._secret === "")
            return value;
        let signature = crypto_1.default
            .createHmac("SHA256", this._secret)
            .update(value)
            .digest("base64url");
        return `${Buffer.from(value, "utf-8").toString("base64url")}.${signature}`;
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
const Cookies = new CookieParser();
exports.Cookies = Cookies;
