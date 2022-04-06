declare class Log {
    private _stdout;
    private _location;
    private _time;
    constructor();
    log(message: string): void;
    changeStdOut(path: string): void;
}
declare const Logger: Log;
export { Logger };
