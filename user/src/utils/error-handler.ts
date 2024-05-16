// combined-error-handler.ts

import { createLogger, transports, Logger } from "winston";
import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

const logDirectory = "Logs";
const logFileName = "app_error.log";

// Ensure the log directory exists; create it if it doesn't
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
} else {
  // check file size
  const stats = fs.statSync(path.join(logDirectory, logFileName));
  const fileSizeInBytes = stats.size;
  // if file size is greater than 5MB then create a new file and copy old file data to the new file
  if (fileSizeInBytes > 5242880) {
    const newFileName = `app_error_${new Date().getTime()}.log`;
    fs.renameSync(path.join(logDirectory, logFileName), path.join(logDirectory, newFileName));

    // clear old file
    fs.truncateSync(path.join(logDirectory, logFileName), 0);
  }
}

const logFilePath = path.join(logDirectory, logFileName);

const LogErrors: Logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: logFilePath }),
  ],
});

class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  errorStack: boolean;
  logError: boolean;

  constructor(
    name: string,
    statusCode: number,
    description: string,
    isOperational: boolean,
    errorStack: boolean,
    logingErrorResponse: boolean
  ) {
    super(description);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errorStack = errorStack;
    this.logError = logingErrorResponse;
  }
}

const errorLogger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: logFilePath }),
  ],
});

// Middleware to handle errors
const ErrorHandler = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    } else {
      // Handle other non-trusted errors here
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  next();
};

export default ErrorHandler;
