/// <reference types="node" />
import http from "http";
import { CookieOptions } from "./Cookies";
declare class Response {
    private _response;
    private _headers;
    private _cookies;
    private _status;
    constructor(response: http.ServerResponse);
    addHeader(name: string, value: any): this;
    addHeader(headers: {
        [key: string]: any;
    }): this;
    cookie(name: string, value: string, options: CookieOptions): this;
    status(code: number): this;
    send(data: any): void;
}
export { Response };
