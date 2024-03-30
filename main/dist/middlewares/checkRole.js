"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
async function isAdmin(req, res, next) {
    // check req.user.roleName
    let authUser = req.user;
    console.log("authUser", authUser);
    if (authUser.roleName === "admin") {
        next();
    }
    else {
        return res.status(403).json({ message: "Not Authorized" });
    }
}
exports.isAdmin = isAdmin;
