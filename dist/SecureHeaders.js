"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityHeaders = void 0;
class SecureHeaders {
    constructor() {
        this._headers = {};
    }
    crossOrigin(options) {
        this._mapObject(options);
        return this;
    }
    expectCT(options) {
        let keys = Object.keys(options);
        let header = [];
        keys.forEach((key) => {
            if (key !== "report-uri") {
                header.push(key);
                return;
            }
            header.push(`${key}=${options[key]}`);
        });
        this._headers["Expect-CT"] = header.join(",");
        return this;
    }
    referrerPolicy(option) {
        this._headers["Referrer-Policy"] = option;
        return this;
    }
    strictTransfer(options) {
        let keys = Object.keys(options);
        let headers = [];
        keys.forEach((key) => {
            let value = options[key];
            switch (key) {
                case "includeSubDomains":
                    if (value) {
                        headers.push(key);
                    }
                    break;
                case "max-age":
                    headers.push(`${key}=${options[key]}`);
                    break;
                case "preload":
                    if (value) {
                        headers.push(key);
                        break;
                    }
            }
        });
        this._headers["Strict-Transport-Security"] = headers.join(";");
        return this;
    }
    noSniff(option) {
        if (option) {
            this._headers["X-Content-Type-Options"] = "nosniff";
        }
        return this;
    }
    dnsPrefetch(option) {
        this._headers["X-DNS-Prefetch-Control"] = option;
        return this;
    }
    xFrame(option) {
        this._headers["X-Frame-Options"] = option;
        return this;
    }
    XSSProtection(options) {
        if (!options.enable) {
            this._headers["X-XSS-Protection"] = "0";
            return this;
        }
        let keys = Object.keys(options);
        let headers = [];
        keys.forEach((key) => {
            if (key === "enable") {
                headers.push(1);
                return;
            }
            headers.push(`${key}=${options[key]}`);
            return;
        });
        return this;
    }
    getHeaders() {
        return this._headers;
    }
    _mapObject(options) {
        let keys = Object.keys(options);
        keys.forEach((key) => {
            this._headers[key] = options[key];
        });
    }
}
const SecurityHeaders = new SecureHeaders();
exports.SecurityHeaders = SecurityHeaders;
