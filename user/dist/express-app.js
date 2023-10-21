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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// import { Admin } from './api';
// import { Other } from './api';
// import { Buyer } from './api';
// import { Seller } from './api';
const error_handler_1 = __importDefault(require("./utils/error-handler"));
exports.default = (app) => __awaiter(void 0, void 0, void 0, function* () {
    app.use(express_1.default.json({ limit: '1mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '1mb' }));
    app.use((0, cors_1.default)());
    //   app.use(express.static(__dirname + '/public');
    // API
    //   Admin(app);
    //   Seller(app);
    //   Buyer(app);
    //   Other(app);
    // Error handling
    app.use(error_handler_1.default);
});
