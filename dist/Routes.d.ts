import { Request } from "./Request";
import { Response } from "./Response";
import { HephaestusServer } from "./Server/Server";
declare type HttpContract = {
    request: Request;
    response: Response;
    application: HephaestusServer;
};
declare type HttpVerb = "GET" | "POST" | "PUT" | "HEAD" | "DELETE" | "PATCH" | "NOT_FOUND";
declare class Router {
    private _table;
    private _group;
    constructor();
    private _addRoute;
    private _getParts;
    getCallback(route: string, method: HttpVerb): {
        parameter: {
            [key: string]: string;
        };
        callback: (httpContract: HttpContract) => any;
    };
    get(route: string, callback: (httpContract: HttpContract) => any): void;
    post(route: string, callback: (httpContract: HttpContract) => any): void;
    put(route: string, callback: (httpContract: HttpContract) => any): void;
    head(route: string, callback: (httpContract: HttpContract) => any): void;
    delete(route: string, callback: (httpContract: HttpContract) => any): void;
    patch(route: string, callback: (httpContract: HttpContract) => any): void;
    notFound(callback: (httpContract: HttpContract) => any): void;
    group(path: string, callback: () => void): void;
    static(dir: string, options?: {
        [key in "prefix" | "path"]: string;
    }): void;
}
export declare const Routes: Router;
export { HttpVerb };
