import { UsersModel } from '../database/models';
import { ValidateSignature } from '../utils';
import { Request, Response, NextFunction } from 'express';

export default async (req: any, res: Response, next: NextFunction) => {
  const isAuthorized: boolean = await ValidateSignature(req);

  await UsersModel.updateOne(
    { _id: req?.user?._id },
    { $inc: { interection: 1 } }
  );

  if (isAuthorized) {
    return next();
  }
  return res.status(403).json({ message: 'Not Authorized' });
};