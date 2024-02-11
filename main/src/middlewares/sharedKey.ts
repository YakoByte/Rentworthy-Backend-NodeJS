import { Request, Response, NextFunction } from "express";
import { WEB_IDENTIFIER, APP_IDENTIFIER } from "../config";

interface CustomHeaders {
  identifier: string;
}

const ValidateKey = async (req: Request<{}, {}, {}, CustomHeaders>, res: Response, next: NextFunction) => {  
  let isKeyValid = false;
  if (req.headers.identifier === APP_IDENTIFIER || req.headers.identifier === WEB_IDENTIFIER) {
    isKeyValid = true;
  }

  if (isKeyValid) {
    return next();
  }

  return res.status(401).json({ error: "Not Authorized.....!" });
};

export { ValidateKey }
