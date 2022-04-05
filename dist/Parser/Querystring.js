"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseQuerystring = void 0;
const parseQuerystring = (url) => {
    let query = {};
    let [_url, querystring] = url.split("?");
    if (!querystring) {
        return { _url, query };
    }
    query = Object.fromEntries(querystring.split("&").map((pair) => pair.split("=")));
    return { _url, query };
};
exports.parseQuerystring = parseQuerystring;
