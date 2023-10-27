import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    user?: {
        _id: string;
    };
}
export interface User extends Document {
    userName: string;
    phoneNo?: number;
    phoneCode?: string;
    email?: string;
    bussinessType?: string;
    password: string;
    stripe?: string;
    roleId: Types.ObjectId;
    appleId?: string;
    location?: string;
    address?: Types.ObjectId[];
    isGuest?: boolean;
    isAuthenticated?: boolean;
    isActive?: boolean;
    isBlocked?: boolean;
    isReported?: boolean;
    profileImage?: string;
    isDeleted?: boolean;
}
export interface userSignRequest {
    userName: string;
    phoneNo?: number;
    phoneCode?: string;
    bussinessType?: string;
    email?: string;
    password: string;
    stripe?: string;
    roleId: string;
    appleId?: string;
    location?: string;
    isGuest?: boolean;
    isAuthenticated?: boolean;
    isActive?: boolean;
    isBlocked?: boolean;
    isReported?: boolean;
    isDeleted?: boolean;
    roleName?: string;
}
export interface userLoginRequest {
    email?: string;
    phoneNo?: string;
    password: string;
    bussinessType?: string;
    roleName: string;
}

export interface userSetPasswordRequest {
    _id: string;
    oldPassword: string;
    newPassword: string;
}