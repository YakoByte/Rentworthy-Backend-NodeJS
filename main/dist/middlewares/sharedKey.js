"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateKey = void 0;
const config_1 = require("../config");
const ValidateKey = async (req, res, next) => {
    let isKeyValid = false;
    if (req.headers.identifier === config_1.APP_IDENTIFIER || req.headers.identifier === config_1.WEB_IDENTIFIER) {
        isKeyValid = true;
    }
    if (isKeyValid) {
        return next();
    }
    return res.status(401).json({ error: "Not Authorized.....!" });
};
exports.ValidateKey = ValidateKey;
