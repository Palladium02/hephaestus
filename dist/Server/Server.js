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
const https_1 = __importDefault(require("https"));
const Routes_1 = require("../Routes");
const Body_1 = require("../Parser/Body");
const Querystring_1 = require("../Parser/Querystring");
const Request_1 = require("../Request");
const Response_1 = require("../Response");
const SecureHeaders_1 = require("../SecureHeaders");
const Exceptions_1 = require("./Exceptions");
require("../Logger");
class HephaestusServer {
    constructor() {
        this._httpRedirect = null;
        this._isHttps = false;
        this._events = new Map(Exceptions_1.Expections);
        this._server = http_1.default.createServer((request, response) => __awaiter(this, void 0, void 0, function* () {
            yield this._listener(request, response);
        }));
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
                let { _url, query } = (0, Querystring_1.parseQuerystring)(url);
                let { callback, parameter } = Routes_1.Routes.getCallback(_url, method);
                let _request = new Request_1.Request(request, (0, Body_1.parseBody)(body, request.headers["content-type"] || ""), parameter, query);
                let _response = new Response_1.Response(response);
                _response.addHeader(SecureHeaders_1.SecurityHeaders.getHeaders());
                callback({ request: _request, response: _response, application: this });
            });
        });
    }
    on(event, callback) {
        this._events.set(event, callback);
    }
    emit(event, data) {
        let _event = this._events.get(event);
        if (_event)
            _event(data);
    }
    listen(port) {
        if (port) {
            this._server.listen(port);
        }
        else {
            this._isHttps ? this._server.listen(443) : this._server.listen(80);
        }
        this.emit("started", { date: Date.now() });
    }
    getServer() {
        return this._server;
    }
    makeHttps(options) {
        this._isHttps = true;
        this._server.close();
        this._server = https_1.default.createServer(options, (request, response) => __awaiter(this, void 0, void 0, function* () {
            yield this._listener(request, response);
        }));
        this._httpRedirect = http_1.default
            .createServer((request, response) => {
            let url = request.url;
            response.writeHead(301, {
                location: url,
            });
            response.end();
        })
            .listen(80);
    }
}
exports.HephaestusServer = HephaestusServer;
const Hephaestus = new HephaestusServer();
exports.Hephaestus = Hephaestus;
