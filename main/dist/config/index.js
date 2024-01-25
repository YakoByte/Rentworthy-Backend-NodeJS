"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GEOLOCATION_API_KEY = exports.GOOGLE_EMAIL = exports.GOOGLE_PASS = exports.SECRET_KEY = exports.DATABASE = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT || '';
exports.DATABASE = process.env.DATABASE || '';
exports.SECRET_KEY = process.env.SECRET_KEY || '';
exports.GOOGLE_PASS = process.env.GOOGLE_PASS || '';
exports.GOOGLE_EMAIL = process.env.GOOGLE_EMAIL || '';
exports.GEOLOCATION_API_KEY = process.env.GEOLOCATION_API_KEY || '';
