"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUS_CODES = exports.ValidationError = exports.BadRequestError = exports.APIError = exports.AppError = void 0;
const STATUS_CODES = {
    OK: 200,
    BAD_REQUEST: 400,
    UN_AUTHORISED: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
};
exports.STATUS_CODES = STATUS_CODES;
class AppError extends Error {
    constructor(name, statusCode, description, isOperational, errorStack, logingErrorResponse) {
        super(description);
        this.name = name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.errorStack = errorStack;
        this.logError = logingErrorResponse;
    }
}
exports.AppError = AppError;
// 500
class APIError extends AppError {
    constructor(name, statusCode = STATUS_CODES.INTERNAL_ERROR, description = "Internal Server Error", isOperational = true) {
        super(name, statusCode, description, isOperational, false, false);
    }
}
exports.APIError = APIError;
// 404
class BadRequestError extends AppError {
    constructor(description = "Bad request", logingErrorResponse) {
        super("NOT FOUND", STATUS_CODES.BAD_REQUEST, description, true, false, logingErrorResponse);
    }
}
exports.BadRequestError = BadRequestError;
// 400
class ValidationError extends AppError {
    constructor(description = "Validation Error", errorStack) {
        super("BAD REQUEST", STATUS_CODES.BAD_REQUEST, description, true, errorStack, false);
    }
}
exports.ValidationError = ValidationError;
