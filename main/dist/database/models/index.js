"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModel = exports.messageModel = exports.roomModel = exports.historyModel = void 0;
// import addressModel from './address';
const history_1 = __importDefault(require("./history"));
exports.historyModel = history_1.default;
const room_1 = __importDefault(require("./room"));
exports.roomModel = room_1.default;
const messages_1 = __importDefault(require("./messages"));
exports.messageModel = messages_1.default;
const user_1 = __importDefault(require("./user"));
exports.UsersModel = user_1.default;
