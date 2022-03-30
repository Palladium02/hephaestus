/// <reference types="node" />
import http from "http";
import https from "https";
declare class HephaestusServer {
    private _server;
    private _httpRedirect;
    private _isHttps;
    private _events;
    constructor();
    private _listener;
    on(event: string, callback: () => void): void;
    emit(event: string, data: any): void;
    listen(port?: number): void;
    getServer(): http.Server | https.Server;
    makeHttps(options: {
        [key in "key" | "cert"]: string;
    }): void;
}
declare const Hephaestus: HephaestusServer;
export { Hephaestus, HephaestusServer };
