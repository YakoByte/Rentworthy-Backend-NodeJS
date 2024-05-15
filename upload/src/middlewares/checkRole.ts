import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../interface/imageUpload";

export async function isAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  // check req.user.roleName
  let authUser: any = req.user;
  if (authUser.roleName === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Not Authorized" });
  }
}
