/// <reference types="node" />
import http from "http";
import https from "https";
declare type EventNames = "boot" | "booted" | "config";
declare class HephaestusServer {
    private _server;
    private _events;
    private _exceptions;
    constructor();
    private _listener;
    on(event: EventNames, callback: () => void): void;
    exception(exception: string, callback: (data: any) => void): void;
    throw(exception: string, data: any): void;
    boot(port?: number): Promise<void>;
    getServer(): http.Server | https.Server | null;
}
declare const Hephaestus: HephaestusServer;
export { Hephaestus, HephaestusServer };
