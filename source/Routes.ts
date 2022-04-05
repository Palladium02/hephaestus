/**
 * Copyright Sean Meyer 2022. All Rights Reserved.
 * Node module: hephaestus
 * This file is licensed under the MIT License.
 * License text available at https://opensource.org/license/MIT
 *
 * The following contains the source code for the router object for the
 * Hephaestus framework.
 *
 * The Router object implements different public and private methods which will
 * be explained in the following section.
 *
 * _addRoute - route (string), method (HttpVerb), callback (httpContract: HttpContract)
 *
 * "_addRoute" is the underlaying method for adding routes to the "_table" property.
 * This method is being called by all the alias methods (e.g. get, post...).
 * Adding routes is achieved by disecting the given route into multiple parts
 * (e.g. /api/user => ["/api", "/user"]). These parts are then used to traveser the
 * tree like structure of the routing table.
 *
 *
 * _getParts - route (string)
 *
 * "_getParts" is being used to split a given route into it's parts.
 *
 *
 * getCallback - route (string), method (HttpVerb)
 *
 * "getCallback" is being used on every request to find the correct callback mapped
 * to the given route if existing. The given route is being broken into it's parts
 * which are used then used to traverse through the routing table. If the given route
 * is not found the 404 callback is returned. In case a given part does not exist but
 * a route parameter at exact the same level was registered that path is taken and
 * the parameter and it's value is being noted.
 *
 *
 * static - dir (string), path (string)
 *
 * "static" can be used to register routes for serving static files.
 *
 */

import fs from "fs";
import { Request } from "./Request";
import { Response } from "./Response";
import { HephaestusServer } from "./Server";

type HttpContract = {
  request: Request;
  response: Response;
  application: HephaestusServer;
};
type HttpVerb =
  | "GET"
  | "POST"
  | "PUT"
  | "HEAD"
  | "DELETE"
  | "PATCH"
  | "NOT_FOUND";
type RouteTree = {
  [key: string]: {
    callback?: (httpContract: HttpContract) => any;
    children?: RouteTree;
  };
};

class Router {
  private _table: { [key in HttpVerb]: RouteTree };
  private _group: string[];

  constructor() {
    this._group = [];
    this._table = {
      GET: {},
      POST: {},
      PUT: {},
      HEAD: {},
      DELETE: {},
      PATCH: {},
      NOT_FOUND: {
        "404": {
          callback: (httpContract: HttpContract) => {
            httpContract.response.status(404).send("Page not found.");
          },
        },
      },
    };
  }

  private _addRoute(
    route: string,
    method: HttpVerb,
    callback: (httpContract: HttpContract) => any
  ) {
    let parts = [...this._group, ...this._getParts(route)];
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
    callback: (httpContract: HttpContract) => any;
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
          };
        }
      }
    }
    return { parameter, callback: current[last].callback! };
  }

  public get(route: string, callback: (httpContract: HttpContract) => any) {
    this._addRoute(route, "GET", callback);
  }

  public post(route: string, callback: (httpContract: HttpContract) => any) {
    this._addRoute(route, "POST", callback);
  }

  public put(route: string, callback: (httpContract: HttpContract) => any) {
    this._addRoute(route, "PUT", callback);
  }

  public head(route: string, callback: (httpContract: HttpContract) => any) {
    this._addRoute(route, "HEAD", callback);
  }

  public delete(route: string, callback: (httpContract: HttpContract) => any) {
    this._addRoute(route, "DELETE", callback);
  }

  public patch(route: string, callback: (httpContract: HttpContract) => any) {
    this._addRoute(route, "PATCH", callback);
  }

  public notFound(callback: (httpContract: HttpContract) => any) {
    this._table.NOT_FOUND["404"].callback = callback;
  }

  public group(path: string, callback: () => void) {
    console.log(this._getParts(path));
    this._group.push(...this._getParts(path));
    console.log(this._group);
    callback();
    for (let i = 0; i < this._getParts(path).length; i++) {
      this._group.pop();
    }
  }

  public static(
    dir: string,
    options: { [key in "prefix" | "path"]: string } = { path: "", prefix: "" }
  ) {
    let { path, prefix } = options;
    let files = fs.readdirSync(dir + path);
    files.forEach((file) => {
      if (file.split(".").length >= 2) {
        let route = (prefix + path + "\\" + file).replace(/\\/g, "/");
        this.get(route, ({ response, application }) => {
          if (fs.existsSync(dir + path + "\\" + file)) {
            response
              .status(200)
              .send(fs.readFileSync(dir + path + "\\" + file));
          } else {
            application.emit("Exception.static.notFound", {
              file,
              date: Date.now(),
            });
            response.status(404).send(`No such file: ${file}`);
          }
        });
      } else {
        this.static(dir, {
          prefix,
          path: path + "\\" + file,
        });
      }
    });
  }
}

export const Routes = new Router();
export { HttpVerb };
