import fs from "fs";
import { Request } from "./Request";
import { Response } from "./Response";

type HttpVerb = "GET" | "POST" | "PUT" | "NOT_FOUND";
type RouteTree = {
  [key: string]: {
    callback?: (request: Request, response: Response) => any;
    children?: RouteTree;
  };
};

class Router {
  private _table: { [key in HttpVerb]: RouteTree };

  constructor() {
    this._table = {
      GET: {},
      POST: {},
      PUT: {},
      NOT_FOUND: {
        "404": {
          callback: (request, response) => {
            // console.log("Not Found");
            response.status(404).send("Page not found.");
          },
        },
      },
    };
  }

  private _addRoute(
    route: string,
    method: HttpVerb,
    callback: (request: Request, response: Response) => any
  ) {
    let parts = this._getParts(route);
    let current = this._table[method]!;
    let last: string = "";
    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = {
          children: {},
        };
      }
      last = part;
      if (index !== parts.length - 1) {
        current = current[part].children!;
      } else {
        current[last].callback = callback;
      }
    });
  }

  private _getParts(route: string) {
    let parts = [];
    let current = "";
    let characters = route.split("");
    for (let i = 0; i < characters.length; i++) {
      current += characters[i];
      if (characters[i + 1] && characters[i + 1] === "/") {
        parts.push(current);
        current = "";
      }
    }
    if (current !== "") parts.push(current);
    return parts;
  }

  public getCallback(
    route: string,
    method: HttpVerb
  ): {
    parameter: { [key: string]: string };
    error: string | null;
    callback: (request: Request, response: Response) => any;
  } {
    let parts = this._getParts(route);
    let current = this._table[method]!;
    let last = "";
    let parameter: { [key: string]: string } = {};
    for (let i = 0; i < parts.length; i++) {
      let part = parts[i];
      last = part;
      if (current[part]) {
        if (i < parts.length - 1) {
          current = current[part].children!;
        }
      } else {
        let suspects = Object.keys(current);
        let parameterized = new RegExp(/\/\:[a-zA-Z]+/gm);
        let match = false;
        for (let j = 0; j < suspects.length; j++) {
          let suspect = suspects[j];
          last = suspect;
          if (parameterized.test(suspect)) {
            let key = suspect.split(":")[1];
            parameter[key] = part.split("/")[1];
            if (i < parts.length - 1) {
              current = current[suspect].children!;
            }
            match = true;
            break;
          }
        }
        if (!match) {
          return {
            parameter,
            callback: this._table["NOT_FOUND"]["404"].callback!,
            error: "404",
          };
        }
      }
    }
    return { parameter, callback: current[last].callback!, error: null };
  }

  public get(
    route: string,
    callback: (request: Request, response: Response) => any
  ) {
    this._addRoute(route, "GET", callback);
  }

  public post(
    route: string,
    callback: (request: Request, response: Response) => any
  ) {
    this._addRoute(route, "POST", callback);
  }

  public put(
    route: string,
    callback: (request: Request, response: Response) => any
  ) {
    this._addRoute(route, "PUT", callback);
  }

  public notFound(callback: (request: Request, response: Response) => any) {
    this._table.NOT_FOUND["404"].callback = callback;
  }

  public static(dir: string, path: string) {
    let files = fs.readdirSync(dir + path);
    console.log(files);
    files.forEach((file) => {
      if (file.split(".").length === 2) {
        let route = (path + "\\" + file).replace(/\\/g, "/");

        this.get(route, (req, res) => {
          res.status(200).send(fs.readFileSync(dir + path + "\\" + file));
        });
      } else {
        this.static(dir, path + "\\" + file);
      }
    });
  }
}

export const Routes = new Router();
export { HttpVerb };
