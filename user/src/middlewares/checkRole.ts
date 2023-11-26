import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../interface/user";
// import RoleRepository from '../../../user/src/database/repository/role';
// import UserSchema from '../../../user/src/database/models/user';
// import RoleSchema from '../../../user/src/database/models/role';

export async function isAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  // check req.user.roleName
  let authUser: any = req.user;
  console.log("authUser", authUser);
  if (authUser.roleName === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Not Authorized" });
  }
}
