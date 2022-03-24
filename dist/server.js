"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HephaestusServer = exports.Hephaestus = void 0;
const http_1 = __importDefault(require("http"));
const Routes_1 = require("./Routes");
const Body_1 = require("./Body");
const Request_1 = require("./Request");
const Response_1 = require("./Response");
class HephaestusServer {
    constructor() {
        this._events = {
            boot: () => { },
            booted: () => { },
            config: () => { },
        };
        this._exceptions = new Map();
        this._server = null;
    }
    _listener(request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let body = [];
            let method = (((_a = request === null || request === void 0 ? void 0 : request.method) === null || _a === void 0 ? void 0 : _a.toUpperCase()) || "GET");
            let url = (request === null || request === void 0 ? void 0 : request.url) || "/";
            request.on("data", (chunk) => {
                body.push(chunk);
            });
            request.on("end", () => {
                let urlParts = url.split("?");
                let queryParameter = {};
                if (urlParts[1]) {
                    queryParameter = Object.fromEntries(urlParts[1].split("&").map((pairs) => pairs.split("=")));
                }
                let { callback, parameter, error } = Routes_1.Routes.getCallback(urlParts[0], method);
                let _request = new Request_1.Request(request, (0, Body_1.parseBody)(body, request.headers["content-type"] || ""), parameter, queryParameter);
                let _response = new Response_1.Response(response);
                callback({ request: _request, response: _response, application: this });
            });
        });
    }
    on(event, callback) {
        this._events[event] = callback;
    }
    exception(exception, callback) {
        this._exceptions.set(exception, callback);
    }
    throw(exception, data) {
        let _exception = this._exceptions.get(exception);
        if (_exception)
            _exception(data);
    }
    boot(port = 80) {
        return __awaiter(this, void 0, void 0, function* () {
            this._events.boot();
            this._server = http_1.default.createServer((request, response) => __awaiter(this, void 0, void 0, function* () {
                yield this._listener(request, response);
            }));
            this._server.listen(port);
            this._events.booted();
        });
    }
    getServer() {
        return this._server;
    }
}
exports.HephaestusServer = HephaestusServer;
const Hephaestus = new HephaestusServer();
exports.Hephaestus = Hephaestus;
