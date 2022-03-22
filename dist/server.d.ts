declare type EventNames = "boot" | "booted" | "config";
declare class Hephaestus {
    private _server;
    private _events;
    constructor();
    private _listener;
    on(event: EventNames, callback: () => void): void;
    boot(port?: number): Promise<void>;
}
export { Hephaestus };
