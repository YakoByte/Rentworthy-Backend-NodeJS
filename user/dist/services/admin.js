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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const admin_1 = __importDefault(require("../database/repository/admin"));
const utils_1 = require("../utils");
const app_error_1 = require("../utils/app-error");
// All Business logic will be here
class AdminService {
    constructor() {
        this.repository = new admin_1.default();
    }
    SignIn(userInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = userInputs;
            try {
                const existingAdmin = yield this.repository.FindUser({ email });
                if (existingAdmin) {
                    const validPassword = yield (0, utils_1.ValidatePassword)(password, existingAdmin.password);
                    if (validPassword) {
                        const token = yield (0, utils_1.GenerateSignature)({
                            email: existingAdmin.email,
                            _id: existingAdmin._id,
                        });
                        return (0, utils_1.FormateData)({ id: existingAdmin._id, token });
                    }
                }
                return (0, utils_1.FormateData)(null);
            }
            catch (err) {
                throw new app_error_1.APIError("Data Not found", err);
            }
        });
    }
    SignUp(userInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, userName, password, phoneNo } = userInputs;
            try {
                let salt = yield (0, utils_1.GenerateSalt)();
                let userPassword = yield (0, utils_1.GeneratePassword)(password, salt);
                const existingAdmin = yield this.repository.CreateUser({
                    email,
                    userName,
                    password: userPassword,
                    phoneNo,
                });
                const token = yield (0, utils_1.GenerateSignature)({
                    email: email,
                    _id: existingAdmin._id,
                });
                return (0, utils_1.FormateData)({ token });
            }
            catch (err) {
                throw new app_error_1.APIError("Data Not found", err);
            }
        });
    }
    CreateUser(userInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, userName, password, phoneNo } = userInputs;
            try {
                let salt = yield (0, utils_1.GenerateSalt)();
                let userPassword = yield (0, utils_1.GeneratePassword)(password, salt);
                const existingAdmin = yield this.repository.CreateUser({
                    email,
                    userName,
                    password: userPassword,
                    phoneNo,
                });
                const token = yield (0, utils_1.GenerateSignature)({
                    email: email,
                    _id: existingAdmin._id,
                });
                return (0, utils_1.FormateData)({ token });
            }
            catch (err) {
                throw new app_error_1.APIError("Data Not found", err);
            }
        });
    }
    // async AddNewAddress(userInputs: {
    //     userId: string,
    //     address1: string,
    //     address2: string,
    //     city: string,
    //     state: string,
    //     postalCode: string,
    //     country: string
    // }) {
    //     const { userId, address1, address2, city, state, postalCode, country } = userInputs;
    //     try {
    //         const addressResult = await this.repository.CreateAddress({
    //             userId,
    //             address1,
    //             address2,
    //             city,
    //             state,
    //             postalCode,
    //             country,
    //         });
    //         return FormateData(addressResult);
    //     } catch (err: any) {
    //         throw new APIError("Data Not found", err);
    //     }
    // }
    GetProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingAdmin = yield this.repository.FindUserById({ userId });
                return (0, utils_1.FormateData)(existingAdmin);
            }
            catch (err) {
                throw new app_error_1.APIError("Data Not found", err);
            }
        });
    }
}
module.exports = AdminService;
