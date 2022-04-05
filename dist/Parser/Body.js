"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBody = void 0;
const parseBody = (body, contentType) => {
    let boundary = "--";
    let endBoundary = "--";
    if (contentType.includes("multipart/form-data")) {
        boundary += contentType.split("; ")[1].split("=")[1];
        endBoundary = "--" + contentType.split("; ")[1].split("=")[1] + endBoundary;
        contentType = "multipart/form-data";
    }
    switch (contentType) {
        case "application/json":
            return JSON.parse(makeString(body));
        case "application/x-www-form-urlencoded":
            return parseURLEncoded(makeString(body));
        case "multipart/form-data":
            return parseMultipart(body, boundary, endBoundary);
        case "text/plain":
            return makeString(body);
        default:
            return body;
    }
};
exports.parseBody = parseBody;
const makeString = (body) => {
    let parsed = "";
    body.forEach((chunk) => {
        parsed += chunk.toString();
    });
    return parsed;
};
const parseURLEncoded = (body) => {
    return Object.fromEntries(body.split("&").map((pair) => {
        return pair.split("=");
    }));
};
const parseMultipart = (body, boundary, endBoundary) => {
    let parsedBody = {};
    let _body = [];
    body.forEach((buffer) => {
        _body.push(...Array.from(buffer));
    });
    let stringifiedBody = _body.join("$");
    let modifiedBoundary = Array.from(Buffer.from(boundary)).join("$");
    let modifiedEndBoundary = Array.from(Buffer.from(endBoundary)).join("$");
    stringifiedBody = stringifiedBody.split(modifiedEndBoundary)[0];
    let parts = stringifiedBody.split(modifiedBoundary);
    parts.forEach((part) => {
        if (part === "")
            return;
        let header = part.split("$13$10$13$10$")[0];
        let parsedHeader = parseMultipartHeaders(Buffer.from(header.split("$").map((c) => Number(c))).toString());
        let body = part
            .split(header)[1]
            .split("$")
            .map((c) => Number(c));
        body = body.slice(5, body.length - 3);
        parsedBody[parsedHeader === null || parsedHeader === void 0 ? void 0 : parsedHeader.name] = {
            value: Buffer.from(body),
            filename: parsedHeader["filename"] ? parsedHeader["filename"] : "",
        };
    });
    return parsedBody;
};
const parseMultipartHeaders = (headers) => {
    return Object.fromEntries(headers
        .split("\r\n")[1]
        .split("; ")
        .slice(1)
        .map((part) => {
        return part.split("=").map((value, index) => {
            if (index === 1) {
                return value
                    .split("")
                    .slice(1, value.length - 1)
                    .join("");
            }
            else {
                return value;
            }
        });
    }));
};
