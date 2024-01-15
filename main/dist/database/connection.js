"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
const databaseConnection = async () => {
    try {
        // Connect to MongoDB without the useNewUrlParser and useUnifiedTopology options
        await mongoose_1.default.connect(config_1.DATABASE);
        console.log("MongoDB connected successfully");
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};
exports.default = databaseConnection;
