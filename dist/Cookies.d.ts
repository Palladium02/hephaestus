/// <reference types="node" />
import http from "http";
declare type Cookie = {
    name: string;
    value: string;
    options: CookieOptions;
};
declare type CookieOptions = {
    HttpOnly?: boolean;
    Expires?: string;
    Domain?: string;
    Path?: string;
    Secure?: boolean;
    "Max-Age"?: number;
    "Same-Site"?: SameSite;
};
declare type SameSite = "Strict" | "Lax" | "None";
declare class CookieParser {
    private _secret;
    serialize(cookies: Cookie[]): string[];
    private _serializeOptions;
    private _sign;
    parse(headers: http.IncomingHttpHeaders): {
        [key: string]: string | Error;
    };
    setSigned(secret: string): void;
}
declare const Cookies: CookieParser;
export { Cookies, Cookie, CookieOptions };
