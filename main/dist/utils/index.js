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
exports.ValidateSignature = exports.GenerateSignature = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import SECRET_KEY  from "../config/index";
let secret_key = "YAKOBYTE";
const GenerateSignature = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield jsonwebtoken_1.default.sign(payload, secret_key, { expiresIn: "30d" });
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.GenerateSignature = GenerateSignature;
const ValidateSignature = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        // console.log(token);
        const splitToken = token.split(" ")[1];
        const payload = yield jsonwebtoken_1.default.verify(splitToken, secret_key);
        req.user = payload;
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
});
exports.ValidateSignature = ValidateSignature;
