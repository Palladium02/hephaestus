/**
 * Copyright Sean Meyer 2022. All Rights Reserved.
 * Node module: hephaestus
 * This file is licensed under the MIT License.
 * License text available at https://opensource.org/license/MIT
 *
 * The following file contains the source code for the router object for the
 * Hephaestus framework.
 *
 * This file implements different functions which will be explained in the following
 * section.
 *
 * parseBody - body (any[]), contentType (string)
 *
 * "parseBody" is being called on every request and decides based on the content
 * type how to parse an incomming body.
 *
 *
 * makeString - body (any[])
 *
 * "makeString" creates a stringifiedd body based on a array.
 *
 *
 * parseURLEncoded - body (string)
 *
 * "parseURLEncoded" is being used to parse bodies that has be encoded as
 * "content-type/url-encoded".
 *
 *
 * parseMultipart - body (any[]), boundary (string), endBoundary (string)
 *
 * "parseMultipart" is being used to parse bodies that have been encoded as
 * "multipart/form-data". To achieve that the body is casted into one big array
 * of numbers to avoid loosing information when converting to uft-8 string.
 * That array then is joined by $ as delimiter. To find the single parts of
 * the body the newly created string is split on the endBoundary and then split
 * on the normal boundary.
 * To get the header and the content of each part the parts are split on
 * the pattern [ 0d, 0a, 0d, 0a ] or "$13$10$13$10$" which is equal to "\r\n\r\n".
 * From there the header is being parsed with the "parseMultipartHeaders".
 *
 *
 * parseMultipartHeaders - headers (string)
 *
 * "parseMultipartHeaders" is being used to parse the headers of each
 * field of a multipart request.
 */

const parseBody = (body: any[], contentType: string) => {
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

const makeString = (body: any[]) => {
  let parsed = "";
  body.forEach((chunk) => {
    parsed += chunk.toString();
  });
  return parsed;
};

const parseURLEncoded = (body: string) => {
  return Object.fromEntries(
    body.split("&").map((pair) => {
      return pair.split("=");
    })
  );
};

// split on end boundary
// split on boundary to get fields
// split on [ 0d 0a 0a 0d ] to seperate header and actual body
// 0d = 13; 0a = 10
// <Buffer 00 0d 0a 0d 0a 68 6b 6a 68 6b 0d 0a 00>

const parseMultipart = (body: any[], boundary: string, endBoundary: string) => {
  let parsedBody: { [key: string]: any } = {};
  let _body: any[] = [];
  body.forEach((buffer) => {
    _body.push(...Array.from(buffer));
  });

  let stringifiedBody = _body.join("$");
  let modifiedBoundary = Array.from(Buffer.from(boundary)).join("$");
  let modifiedEndBoundary = Array.from(Buffer.from(endBoundary)).join("$");
  stringifiedBody = stringifiedBody.split(modifiedEndBoundary)[0];
  let parts = stringifiedBody.split(modifiedBoundary);
  parts.forEach((part) => {
    if (part === "") return;
    let header = part.split("$13$10$13$10$")[0];
    let parsedHeader = parseMultipartHeaders(
      Buffer.from(header.split("$").map((c) => Number(c))).toString()
    );
    let body = part
      .split(header)[1]
      .split("$")
      .map((c) => Number(c));
    body = body.slice(5, body.length - 3);
    parsedBody[parsedHeader?.name!] = {
      value: Buffer.from(body),
      filename: parsedHeader["filename"] ? parsedHeader["filename"] : "",
    };
  });

  return parsedBody;
};

const parseMultipartHeaders = (headers: string) => {
  return Object.fromEntries(
    headers
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
          } else {
            return value;
          }
        });
      })
  );
};

export { parseBody };
