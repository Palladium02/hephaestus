import { Request } from "./Request";
import { Response } from "./Response";
declare type HttpVerb = "GET" | "POST" | "PUT" | "NOT_FOUND";
declare class Router {
    private _table;
    constructor();
    private _addRoute;
    private _getParts;
    getCallback(route: string, method: HttpVerb): {
        parameter: {
            [key: string]: string;
        };
        error: string | null;
        callback: (request: Request, response: Response) => any;
    };
    get(route: string, callback: (request: Request, response: Response) => any): void;
    post(route: string, callback: (request: Request, response: Response) => any): void;
    put(route: string, callback: (request: Request, response: Response) => any): void;
    notFound(callback: (request: Request, response: Response) => any): void;
    static(dir: string, path: string): void;
}
export declare const Routes: Router;
export { HttpVerb };
