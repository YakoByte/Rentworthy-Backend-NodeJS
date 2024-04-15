import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    user?: {
        _id: string;
    };
}

export interface getCountAuthenticatedRequest extends Request {
    user?: {
        _id: string;
    };
    query: {
        criteria: string,
    }
}

export interface User extends Document {
    name: string;
    phoneNo?: number;
    phoneCode?: string;
    email?: string;
    bussinessType?: string;
    password: string;
    stripe?: string;
    roleId: Types.ObjectId;
    appleId?: string;
    isGuest?: boolean;
    isActive?: boolean;
    isDeleted?: boolean;
    isBlocked?: boolean;
    loginType?: string;
    os?: string;
    isEmailVerified?: boolean;
    isPhoneNoVerified?: boolean;
    stripAccountId?: string;
    isStripeAccountVerified?: boolean;
    stripeCustomerId?: string;
    isStripeCustomerVerified?: boolean;
}

export interface userSignRequest {
    name?: string;
    phoneNo?: number;
    phoneCode?: string;
    bussinessType?: string;
    email?: string;
    password: string;
    stripe?: string;
    roleId?: string;
    appleId?: string;
    location?: string;
    isGuest?: boolean;
    isActive?: boolean;
    isDeleted?: boolean;
    isBlocked?: boolean;
    roleName?: string;
    loginType?: string;
}

export interface userLoginRequest {
    _id?: string;
    email?: string;
    phoneNo?: string;
    password: string;
    bussinessType?: string;
    roleName: string;
    os?: string;
}

export interface userSetPasswordRequest {
    _id: string;
    oldPassword: string;
    newPassword: string;
}

export interface findMe {
    _id?: string;
    email?: string;
    phoneNo?: string;
}

export interface forgotPassword {
    otp: number;
    email: any;
    phoneNo: any;
    password: string;
    ipAddress?: string;
}

export interface socialUserSignRequest {
    name?: string;
    phoneNo?: number;
    phoneCode?: string;
    bussinessType?: string;
    email?: string;
    stripe?: string;
    roleId?: string;
    appleId?: string;
    location?: string;
    isGuest?: boolean;
    isActive?: boolean;
    isDeleted?: boolean;
    isBlocked?: boolean;
    roleName?: string;
    loginType?: string;
}

export interface socialUserLoginRequest {
    email?: string;
    phoneNo?: string;
    bussinessType?: string;
    roleName: string;
    loginType?: string;
    os?: string;
}

export interface GetUserRequest {
    _id: string;
    email: string;
    phoneNo: string;
    bussinessType: string;
    roleName: string;
    loginType: string;
    os: string;
    isActive: boolean;
    isDeleted: boolean;
    isBlocked: boolean;
    isUnverified: boolean;
    isVerified: boolean;
    page: string;
    limit: string;
}