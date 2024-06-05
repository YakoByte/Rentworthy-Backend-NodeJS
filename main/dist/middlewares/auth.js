"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../database/models");
const utils_1 = require("../utils");
exports.default = async (req, res, next) => {
    try {
        const isAuthorized = await (0, utils_1.ValidateSignature)(req);
        await models_1.UsersModel.updateOne({ _id: req?.user?._id }, { $inc: { interection: 1 } });
        if (isAuthorized) {
            return next();
        }
        return res.status(403).json({ message: "Not Authorized" });
    }
    catch (error) {
        return res.status(403).json({ message: "Not Authorized" });
    }
};
