"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormateData = exports.ValidateSignature = void 0;
// import bcrypt from "bcrypt";
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let secret_key = "YAKOBYTE";
// Utility functions
// export const GenerateSalt = async (): Promise<string> => {
//     return await bcrypt.genSalt(10);
// };
// export const GeneratePassword = async (password: string, salt: string): Promise<string> => {
//     return await bcrypt.hash(password, salt);
// };
// export const ValidatePassword = async (enteredPassword: string, savedPassword: string): Promise<boolean> => {
//     // console.log(enteredPassword, savedPassword)
//     return await bcrypt.compare(enteredPassword, savedPassword);
// };
// export const GenerateSignature = async (payload: any): Promise<string | Error> => {
//     try {
//         const token = await jwt.sign(payload, secret_key, { expiresIn: "10d" });
//         return token;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };
const ValidateSignature = async (req) => {
    try {
        const token = req.headers.authorization;
        console.log("token", token);
        const splitToken = token.split(" ")[1];
        console.log("splitToken", splitToken);
        const payload = await jsonwebtoken_1.default.verify(splitToken, secret_key);
        req.user = payload;
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
};
exports.ValidateSignature = ValidateSignature;
const FormateData = (data) => {
    if (data) {
        return { data };
    }
    else {
        throw new Error("Data Not found!");
    }
};
exports.FormateData = FormateData;
