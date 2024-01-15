"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.SECRET_KEY = exports.DATABASE = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//DATABASE
exports.DATABASE = "mongodb+srv://ecommerce:rejoice123@cluster0.ooqoe24.mongodb.net/rent?retryWrites=true&w=majority";
//SECRET_KEY
exports.SECRET_KEY = process.env.SECRET_KEY;
exports.PORT = process.env.PORT;
