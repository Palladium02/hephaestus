/// <reference types="node" />
import http from "http";
declare class Request {
    private _IncommingMessage;
    headers: http.IncomingHttpHeaders;
    cookies: {
        [key: string]: string | Error;
    };
    body: any;
    params: {
        [key: string]: string;
    };
    query: {
        [key: string]: string;
    };
    url: string;
    constructor(IncomingMessage: http.IncomingMessage, body: any, parameter: {
        [key: string]: string;
    }, queryParameter: {
        [key: string]: string;
    });
}
export { Request };
