"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
const databaseConnection = async () => {
    try {
        await mongoose_1.default.connect(config_1.DATABASE || '');
        console.log('MongoDB connected successfully');
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};
const disconnectDB = async () => {
    try {
        await mongoose_1.default.connection.close();
        console.log('MongoDB disconnected successfully');
    }
    catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
        process.exit(1);
    }
};
exports.disconnectDB = disconnectDB;
exports.default = databaseConnection;
