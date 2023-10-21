"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.historyModel = exports.userModel = void 0;
// import addressModel from './address';
const user_1 = __importDefault(require("./user"));
exports.userModel = user_1.default;
const history_1 = __importDefault(require("./history"));
exports.historyModel = history_1.default;
// export = {
//     // addressModel: require('./address') as any,
//     // adminModel: require('./admin') as any,
//     // badgeModel: require('./badge') as any,
//     // buyerModel: require('./buyer') as any,
//     // couponModel: require('./coupon') as any,
//     // genderModel: require('./gender') as any,
//     // historyModel: require('./history') as any,
//     // loginHistoryModel: require('./loginHistory') as any,
//     // passwordModel: require('./password') as any,
//     // sellerModel: require('./seller') as any, // Note: This was previously pointing to './password' in your original code, which might be an error.
//     userModel: require('./user') as any,
// };
