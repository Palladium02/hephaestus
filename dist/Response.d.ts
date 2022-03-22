/// <reference types="node" />
import http from "http";
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
    cookie(name: string, value: string): this;
    cookie(cookies: {
        [key: string]: string;
    }): this;
    status(code: number): this;
    send(data: any): void;
}
export { Response };
