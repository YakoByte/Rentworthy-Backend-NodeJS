import { Request, Response, NextFunction } from "express";
import { FormateError } from "../utils";
import { WEB_IDENTIFIER, APP_IDENTIFIER } from "../config";

interface CustomHeaders {
  IDENTIFIER: string;
}

const ValidateKey = (req: Request<{}, {}, {}, CustomHeaders>, res: Response, next: NextFunction) => {
  const isKeyValid = req.headers.IDENTIFIER === APP_IDENTIFIER || req.headers.IDENTIFIER === WEB_IDENTIFIER;

  if (isKeyValid) {
    return next();
  }

  return FormateError({ error: "Not Authorized" });
};

export { ValidateKey };
