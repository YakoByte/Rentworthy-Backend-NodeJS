import { createLogger, transports, Logger } from "winston";
import { AppError } from "./app-error";
import { Request, Response, NextFunction } from "express";

const LogErrors: Logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: "app_error.log" }),
  ],
});

class ErrorLogger {
  constructor() {}

  async logError(err: Error) {
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

  isTrustError(error: Error) {
    if (error instanceof AppError) {
      return (error as AppError).isOperational;
    } else {
      return false;
    }
  }
}

const ErrorHandler = async (err: Error, req: Request, res: Response, next: NextFunction) => {
  const errorLogger = new ErrorLogger();

  process.on("uncaughtException", (reason, promise) => {
    console.log(reason, "UNHANDLED");
    throw reason; // need to take care
  });

  process.on("uncaughtException", (error) => {
    errorLogger.logError(error);
    if (errorLogger.isTrustError(error as AppError)) {
      // process exit // need restart
    } 
  });

  if (err) {
    await errorLogger.logError(err);
    if (errorLogger.isTrustError(err as AppError)) {
      if ((err as AppError).errorStack) {
        const errorDescription = (err as AppError).errorStack;
        return res.status((err as AppError).statusCode).json({ message: errorDescription });
      }
      return res.status((err as AppError).statusCode).json({ message: err.message });
    } else {
      // process exit // terribly wrong with flow, need restart
    }
    return res.status((err as AppError).statusCode).json({ message: err.message });
  }
  next();
};

export default ErrorHandler;
