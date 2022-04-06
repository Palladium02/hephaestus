"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const date = () => {
    let now = new Date();
    return `${prefix(now.getDate())}/${prefix(now.getMonth() + 1)}/${prefix(now.getFullYear())}, ${prefix(now.getHours())}:${prefix(now.getMinutes())}:${prefix(now.getSeconds())}`;
};
const prefix = (n) => {
    return n < 10 ? `0${n}` : n.toString();
};
class Log {
    constructor() {
        this._stdout = "stdout";
        this._location = "";
        this._time = new Date()
            .toUTCString()
            .replace(/\s/gm, "")
            .replace(/(\,|\:)/gm, "");
    }
    log(message) {
        if (this._stdout === "stdout") {
            console.log(`[${date()}] - ${message}`);
        }
        if (this._location) {
            if (fs_1.default.existsSync(path_1.default.join(this._location, `${this._time}.txt`))) {
                let content = fs_1.default.readFileSync(path_1.default.join(this._location, `${this._time}.txt`), { encoding: "utf-8" });
                content += `\n[${date()}] - ${message}`;
                fs_1.default.writeFileSync(path_1.default.join(this._location, `${this._time}.txt`), content, { encoding: "utf-8" });
            }
            else {
                let content = `[${date()}] - This is the first log entry.\n[${date()}] - ${message}`;
                fs_1.default.writeFileSync(path_1.default.join(this._location, `${this._time}.txt`), content, { encoding: "utf-8", flag: "w+" });
            }
        }
    }
    changeStdOut(path) {
        this._stdout = "file";
        this._location = path;
    }
}
const Logger = new Log();
exports.Logger = Logger;
