"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expections = void 0;
const Logger_1 = require("../Logger");
exports.Expections = [
    [
        "Exceptions.routes.malformed",
        (data) => {
            Logger_1.Logger.log(`Malformed route (${data === null || data === void 0 ? void 0 : data.route}) was being tried to be registered.`);
        },
    ],
];
