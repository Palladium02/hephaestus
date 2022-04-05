"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const fs_1 = __importDefault(require("fs"));
class Router {
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
                    callback: (httpContract) => {
                        httpContract.response.status(404).send("Page not found.");
                    },
                },
            },
        };
    }
    _addRoute(route, method, callback) {
        let parts = [...this._group, ...this._getParts(route)];
        let current = this._table[method];
        let last = "";
        parts.forEach((part, index) => {
            if (!current[part]) {
                current[part] = {
                    children: {},
                };
            }
            last = part;
            if (index !== parts.length - 1) {
                current = current[part].children;
            }
            else {
                current[last].callback = callback;
            }
        });
    }
    _getParts(route) {
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
        if (current !== "")
            parts.push(current);
        return parts;
    }
    getCallback(route, method) {
        let parts = this._getParts(route);
        let current = this._table[method];
        let last = "";
        let parameter = {};
        for (let i = 0; i < parts.length; i++) {
            let part = parts[i];
            last = part;
            if (current[part]) {
                if (i < parts.length - 1) {
                    current = current[part].children;
                }
            }
            else {
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
                            current = current[suspect].children;
                        }
                        match = true;
                        break;
                    }
                }
                if (!match) {
                    return {
                        parameter,
                        callback: this._table["NOT_FOUND"]["404"].callback,
                    };
                }
            }
        }
        return { parameter, callback: current[last].callback };
    }
    get(route, callback) {
        this._addRoute(route, "GET", callback);
    }
    post(route, callback) {
        this._addRoute(route, "POST", callback);
    }
    put(route, callback) {
        this._addRoute(route, "PUT", callback);
    }
    head(route, callback) {
        this._addRoute(route, "HEAD", callback);
    }
    delete(route, callback) {
        this._addRoute(route, "DELETE", callback);
    }
    patch(route, callback) {
        this._addRoute(route, "PATCH", callback);
    }
    notFound(callback) {
        this._table.NOT_FOUND["404"].callback = callback;
    }
    group(path, callback) {
        console.log(this._getParts(path));
        this._group.push(...this._getParts(path));
        console.log(this._group);
        callback();
        for (let i = 0; i < this._getParts(path).length; i++) {
            this._group.pop();
        }
    }
    static(dir, options = { path: "", prefix: "" }) {
        let { path, prefix } = options;
        let files = fs_1.default.readdirSync(dir + path);
        files.forEach((file) => {
            if (file.split(".").length >= 2) {
                let route = (prefix + path + "\\" + file).replace(/\\/g, "/");
                this.get(route, ({ response, application }) => {
                    if (fs_1.default.existsSync(dir + path + "\\" + file)) {
                        response
                            .status(200)
                            .send(fs_1.default.readFileSync(dir + path + "\\" + file));
                    }
                    else {
                        application.emit("Exception.static.notFound", {
                            file,
                            date: Date.now(),
                        });
                        response.status(404).send(`No such file: ${file}`);
                    }
                });
            }
            else {
                this.static(dir, {
                    prefix,
                    path: path + "\\" + file,
                });
            }
        });
    }
}
exports.Routes = new Router();
