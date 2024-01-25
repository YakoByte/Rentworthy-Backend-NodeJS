"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormateError = exports.FormateData = exports.ValidateSignature = exports.GenerateSignature = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const secret_key = config_1.SECRET_KEY || "";
const GenerateSignature = async (payload) => {
    try {
        const token = await jsonwebtoken_1.default.sign(payload, secret_key, { expiresIn: "10d" });
        return token;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
};
exports.GenerateSignature = GenerateSignature;
const ValidateSignature = async (req) => {
    try {
        const token = req.headers.authorization;
        if (!token)
            return false;
        const splitToken = token.split(" ")[1];
        if (!splitToken)
            return false;
        const payload = await jsonwebtoken_1.default.verify(splitToken, secret_key);
        req.user = payload;
        console.log("payload", payload);
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
};
exports.ValidateSignature = ValidateSignature;
const FormateData = (data) => {
    return data;
};
exports.FormateData = FormateData;
const FormateError = (error) => {
    return error;
};
exports.FormateError = FormateError;
