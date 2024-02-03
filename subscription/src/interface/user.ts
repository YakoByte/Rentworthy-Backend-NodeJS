import mongoose, { Schema, Document, Types } from "mongoose";

export interface User extends Document {
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
    isSubscribed?: boolean;
}