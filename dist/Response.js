"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
const Cookies_1 = require("./Cookies");
class Response {
    constructor(response) {
        this._response = response;
        this._headers = {};
        this._cookies = [];
        this._status = 200;
    }
    addHeader(singleOrMultiple, value) {
        if (typeof singleOrMultiple === "string") {
            this._headers = Object.assign(Object.assign({}, this._headers), { [singleOrMultiple]: value });
            return this;
        }
        this._headers = Object.assign(Object.assign({}, this._headers), singleOrMultiple);
        return this;
    }
    cookie(name, value, options) {
        this._cookies.push({
            name,
            value,
            options,
        });
        return this;
    }
    status(code) {
        this._status = code;
        return this;
    }
    send(data) {
        this._headers = Object.assign(Object.assign({}, this._headers), { "Set-Cookie": Cookies_1.Cookies.serialize(this._cookies) });
        this._response.writeHead(this._status, this._headers);
        this._response.write(data);
        this._response.end();
    }
}
exports.Response = Response;
