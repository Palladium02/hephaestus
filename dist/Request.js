"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const Cookies_1 = require("./Cookies");
class Request {
    constructor(IncomingMessage, body, parameter, queryParamater) {
        this._IncomminMessage = IncomingMessage;
        this.headers = this._IncomminMessage.headers;
        this.cookies = Cookies_1.Cookie.parse(this.headers);
        this.body = body;
        this.parameter = parameter;
        this.queryParameter = queryParamater;
        this.url = this._IncomminMessage.url || "";
    }
}
exports.Request = Request;
