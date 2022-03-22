/// <reference types="node" />
import http from "http";
declare class Cookies {
    private _secret;
    constructor();
    stringify(cookies: {
        [key: string]: string;
    }): {
        "Set-Cookie": string;
    };
    parse(headers: http.IncomingHttpHeaders): {
        [key: string]: string | Error;
    };
    setSigned(secret: string): void;
}
declare const Cookie: Cookies;
export { Cookie };
