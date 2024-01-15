"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
// import RoleRepository from '../../../user/src/database/repository/role';
// import UserSchema from '../../../user/src/database/models/user';
// import RoleSchema from '../../../user/src/database/models/role';
async function isAdmin(req, res, next) {
    // check req.user.roleName
    let authUser = req.user;
    console.log("authUser", authUser);
    if (authUser.roleName === "admin") {
        next();
    }
    else {
        return res.status(403).json({ message: 'Not Authorized' });
    }
}
exports.isAdmin = isAdmin;
