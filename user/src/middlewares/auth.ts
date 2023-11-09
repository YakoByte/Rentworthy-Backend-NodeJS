import { ValidateSignature } from '../utils';
import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  const isAuthorized: boolean = await ValidateSignature(req);

  if (isAuthorized) {
    return next();
  }
  return res.status(403).json({ message: 'Not Authorized' });
};