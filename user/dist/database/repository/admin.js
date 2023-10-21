"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const utils_1 = require("../../utils");
const app_error_1 = require("../../utils/app-error");
class AdminRepository {
    CreateUser({ email, userName, password, phoneNo }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUser = yield models_1.userModel.findOne({ $or: [{ email }, { phoneNo }] });
                if (findUser) {
                    const validPassword = yield (0, utils_1.ValidatePassword)(password, findUser.password);
                    if (validPassword) {
                        const token = yield (0, utils_1.GenerateSignature)({
                            email: findUser.email,
                            _id: findUser._id,
                        });
                        return (0, utils_1.FormateData)({ id: findUser._id, token });
                    }
                    return (0, utils_1.FormateData)(null);
                }
                const user = new models_1.userModel({
                    userName: userName,
                    email: email,
                    password: password,
                    phoneNo: phoneNo,
                });
                const userResult = yield user.save();
                const history = new models_1.historyModel({
                    userId: userResult._id,
                    log: [
                        {
                            objectId: userResult._id,
                            action: `Username = ${userName} created`,
                            date: new Date().toISOString(),
                            time: Date.now(),
                        },
                    ],
                });
                yield history.save();
                return userResult;
            }
            catch (err) {
                throw new app_error_1.APIError("API Error", app_error_1.STATUS_CODES.INTERNAL_ERROR, "Unable to Create User");
            }
        });
    }
    CreateAdmin({ username, email, phoneNo, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = new models_1.userModel({
                    username,
                    contact: [{ phoneNo, email }],
                    isVerified: false, // Assuming this field's type
                });
                const adminResult = yield admin.save();
                const history = new models_1.historyModel({
                    userId: adminResult._id,
                    log: [
                        {
                            objectId: adminResult._id,
                            action: "admin created",
                            date: new Date().toISOString(),
                            time: Date.now(),
                        },
                    ],
                });
                yield history.save();
                return adminResult;
            }
            catch (error) {
                throw new app_error_1.APIError("API Error", app_error_1.STATUS_CODES.INTERNAL_ERROR, "Error on Create Admin");
            }
        });
    }
    // async CreateAddress({
    //   userId,
    //   address1,
    //   address2,
    //   city,
    //   state,
    //   postalCode,
    //   country,
    // }: { userId: string; address1: string; address2: string; city: string; state: string; postalCode: string; country: string }) {
    //   try {
    //     const user = await userModel.findById(userId);
    //     if (user) {
    //       const Address = new addressModel({
    //         address1,
    //         address2,
    //         city,
    //         state,
    //         postalCode,
    //         country,
    //       });
    //       const addressResult = await Address.save();
    //       const history = await historyModel.findOne({ userId });
    //       if (history) {
    //         history.log.push({
    //           objectId: addressResult._id,
    //           action: "address created",
    //           date: new Date().toISOString(),
    //           time: Date.now(),
    //         });
    //         await history.save();
    //       }
    //       return addressResult;
    //     }
    //   } catch (err) {
    //     throw new APIError(
    //       "API Error",
    //       STATUS_CODES.INTERNAL_ERROR,
    //       "Error on Create Address"
    //     );
    //   }
    // }
    FindUser({ email }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userResult = yield models_1.userModel.findOne({ email });
                return userResult;
            }
            catch (error) {
                throw new app_error_1.APIError("API Error", app_error_1.STATUS_CODES.INTERNAL_ERROR, "Error on Find User");
            }
        });
    }
    FindUserById({ userId }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield models_1.userModel.findById(userId);
                // const address = await addressModel.findOne({ userId });
                const profile = yield models_1.userModel.findOne({ _id: userId });
                // const password = await passwordModel.findOne({ userId });
                const userResult = {
                    profileData: profile,
                    // passwordSecurityData: password,
                    // addressData: address,
                };
                return userResult;
            }
            catch (error) {
                throw new app_error_1.APIError("API Error", app_error_1.STATUS_CODES.INTERNAL_ERROR, "Error on Find User by ID");
            }
        });
    }
}
exports.default = AdminRepository;
