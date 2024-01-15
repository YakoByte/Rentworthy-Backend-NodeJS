"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const app_error_1 = require("./app-error");
const LogErrors = (0, winston_1.createLogger)({
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: "app_error.log" }),
    ],
});
class ErrorLogger {
    constructor() { }
    async logError(err) {
        console.log("==================== Start Error Logger ===============");
        LogErrors.log({
            private: true,
            level: "error",
            message: `${new Date()}-${JSON.stringify(err)}`,
        });
        console.log("==================== End Error Logger ===============");
        // log error with Logger plugins
        return false;
    }
    isTrustError(error) {
        if (error instanceof app_error_1.AppError) {
            return error.isOperational;
        }
        else {
            return false;
        }
    }
}
const ErrorHandler = async (err, req, res, next) => {
    const errorLogger = new ErrorLogger();
    process.on("uncaughtException", (reason, promise) => {
        console.log(reason, "UNHANDLED");
        throw reason; // need to take care
    });
    process.on("uncaughtException", (error) => {
        errorLogger.logError(error);
        if (errorLogger.isTrustError(error)) {
            // process exit // need restart
        }
    });
    if (err) {
        await errorLogger.logError(err);
        if (errorLogger.isTrustError(err)) {
            if (err.errorStack) {
                const errorDescription = err.errorStack;
                return res.status(err.statusCode).json({ message: errorDescription });
            }
            return res.status(err.statusCode).json({ message: err.message });
        }
        else {
            // process exit // terribly wrong with flow, need restart
        }
        return res.status(err.statusCode).json({ message: err.message });
    }
    next();
};
exports.default = ErrorHandler;
