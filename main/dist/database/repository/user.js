"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
    },
    phoneNo: {
        type: Number,
        default: null,
    },
    phoneCode: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        default: null,
    },
    password: {
        type: String,
    },
    stripe: {
        type: String,
    },
    roleId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Role",
        required: true,
    },
    bussinessType: {
        type: String,
        enum: ["individual", "company"],
        default: "individual",
    },
    appleId: {
        type: String,
    },
    isGuest: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    loginType: {
        type: String,
        enum: ["google", "facebook", "apple", "regular", "phone"],
        default: "regular"
    },
    os: {
        type: String,
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isPhoneNoVerified: {
        type: Boolean,
        default: false
    },
    stripAccountId: {
        type: String,
    },
    isStripeAccountVerified: {
        type: Boolean,
        default: false
    },
    stripeCustomerId: {
        type: String,
    },
    isStripeCustomerVerified: {
        type: Boolean,
        default: false
    },
    views: {
        type: Number
    },
    interection: {
        type: Number
    }
}, { timestamps: true });
const Users = mongoose_1.default.model("User", userSchema);
exports.default = Users;
