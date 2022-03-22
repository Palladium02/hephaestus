/// <reference types="node" />
import http from "http";
declare class Request {
    private _IncomminMessage;
    headers: http.IncomingHttpHeaders;
    cookies: {
        [key: string]: string | Error;
    };
    body: any;
    parameter: {
        [key: string]: string;
    };
    url: string;
    constructor(IncomingMessage: http.IncomingMessage, body: any, parameter: {
        [key: string]: string;
    });
}
export { Request };
