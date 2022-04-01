"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const Cookies_1 = require("./Cookies");
class Request {
    constructor(IncomingMessage, body, parameter, queryParameter) {
        this._IncommingMessage = IncomingMessage;
        this.headers = this._IncommingMessage.headers;
        this.cookies = Cookies_1.Cookies.parse(this.headers);
        this.body = body;
        this.params = parameter;
        this.query = queryParameter;
        this.url = this._IncommingMessage.url || "";
    }
}
exports.Request = Request;
