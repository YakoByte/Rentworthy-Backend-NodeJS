import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    user?: {
        _id: string;
    };
}
export interface User extends Document {
    // userName?: string;
    phoneNo?: number;
    phoneCode?: string;
    email?: string;
    bussinessType?: string;
    password: string;
    stripe?: string;
    roleId: Types.ObjectId;
    appleId?: string;
    isGuest?: boolean;
    isAuthenticated?: boolean;
    isActive?: boolean;
    isDeleted?: boolean;
    loginType?: string;
    os?: string;
    isEmailVerified?: boolean;
    isPhoneNoVerified?: boolean;
    stripeId?: string;
    isStripIdVerified?: boolean;
}
export interface userSignRequest {
    // userName?: string;
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
    isAuthenticated?: boolean;
    isActive?: boolean;
    isDeleted?: boolean;
    roleName?: string;
    loginType?: string;
}
export interface userLoginRequest {
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
    email?: string;
    phoneNo?: string;
}

export interface socialUserSignRequest {
    // userName?: string;
    phoneNo?: number;
    phoneCode?: string;
    bussinessType?: string;
    email?: string;
    stripe?: string;
    roleId?: string;
    appleId?: string;
    location?: string;
    isGuest?: boolean;
    isAuthenticated?: boolean;
    isActive?: boolean;
    isDeleted?: boolean;
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