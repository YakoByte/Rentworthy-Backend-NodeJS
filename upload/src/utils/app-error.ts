// app-errors.ts

const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UN_AUTHORISED: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

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

// 500
class APIError extends AppError {
  constructor(
      name: string,
      statusCode: number = STATUS_CODES.INTERNAL_ERROR,
      description: string = "Internal Server Error",
      isOperational: boolean = true
  ) {
      super(name, statusCode, description, isOperational, false, false);
  }
}

// 404
class BadRequestError extends AppError {
  constructor(description: string = "Bad request", logingErrorResponse: boolean) {
      super(
          "NOT FOUND",
          STATUS_CODES.BAD_REQUEST,
          description,
          true,
          false,
          logingErrorResponse
      );
  }
}

// 400
class ValidationError extends AppError {
  constructor(description: string = "Validation Error", errorStack: boolean) {
      super(
          "BAD REQUEST",
          STATUS_CODES.BAD_REQUEST,
          description,
          true,
          errorStack,
          false
      );
  }
}

export {
  BadRequestError,
  ValidationError,
  AppError,
  APIError,
  STATUS_CODES,
};
