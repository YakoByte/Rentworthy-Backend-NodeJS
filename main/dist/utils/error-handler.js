"use strict";
// combined-error-handler.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logDirectory = "Logs";
const logFileName = "app_error.log";
// Ensure the log directory exists; create it if it doesn't
if (!fs_1.default.existsSync(logDirectory)) {
    fs_1.default.mkdirSync(logDirectory);
}
else {
    // check file size
    const stats = fs_1.default.statSync(path_1.default.join(logDirectory, logFileName));
    const fileSizeInBytes = stats.size;
    // if file size is greater than 5MB then create a new file and copy old file data to the new file
    if (fileSizeInBytes > 5242880) {
        const newFileName = `app_error_${new Date().getTime()}.log`;
        fs_1.default.renameSync(path_1.default.join(logDirectory, logFileName), path_1.default.join(logDirectory, newFileName));
        // clear old file
        fs_1.default.truncateSync(path_1.default.join(logDirectory, logFileName), 0);
    }
}
const logFilePath = path_1.default.join(logDirectory, logFileName);
const LogErrors = (0, winston_1.createLogger)({
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: logFilePath }),
    ],
});
class AppError extends Error {
    statusCode;
    isOperational;
    errorStack;
    logError;
    constructor(name, statusCode, description, isOperational, errorStack, logingErrorResponse) {
        super(description);
        this.name = name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.errorStack = errorStack;
        this.logError = logingErrorResponse;
    }
}
const errorLogger = (0, winston_1.createLogger)({
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: logFilePath }),
    ],
});
// Middleware to handle errors
const ErrorHandler = async (err, req, res, next) => {
    if (err) {
        console.log(err);
        console.log("==================== Start Error Logger ===============");
        errorLogger.log({
            private: true,
            level: "error",
            message: `${new Date()}-${err}`,
        });
        console.log("==================== End Error Logger ===============");
        if (err instanceof AppError) {
            const statusCode = err.statusCode || 500;
            if (err.errorStack) {
                const errorDescription = err.errorStack;
                return res.status(statusCode).json({ message: errorDescription });
            }
            return res.status(statusCode).json({ message: err.message });
        }
        else {
            // Handle other non-trusted errors here
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    next();
};
exports.default = ErrorHandler;
