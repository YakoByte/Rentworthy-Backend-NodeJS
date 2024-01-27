"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GEOLOCATION_API_KEY = exports.AWS_BUCKET_NAME = exports.AWS_BUCKET_REGION = exports.AWS_SECRET_ACCESS_KEY = exports.AWS_ACCESS_KEY_ID = exports.GOOGLE_EMAIL = exports.GOOGLE_PASS = exports.SECRET_KEY = exports.DATABASE = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT || '';
exports.DATABASE = process.env.DATABASE || '';
exports.SECRET_KEY = process.env.SECRET_KEY || '';
exports.GOOGLE_PASS = process.env.GOOGLE_PASS || '';
exports.GOOGLE_EMAIL = process.env.GOOGLE_EMAIL || '';
exports.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';
exports.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';
exports.AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION || '';
exports.AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME || '';
exports.GEOLOCATION_API_KEY = process.env.GEOLOCATION_API_KEY || '';
