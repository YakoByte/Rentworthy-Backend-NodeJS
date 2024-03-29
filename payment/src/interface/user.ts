import { Document, Types } from "mongoose";

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
    isAuthenticated?: boolean;
    isActive?: boolean;
    isDeleted?: boolean;
    loginType?: string;
    os?: string;
    isEmailVerified?: boolean;
    isPhoneNoVerified?: boolean;
    stripAccountId?: string;
    isStripeAccountVerified?: boolean;
    stripeCustomerId?: string;
    isStripeCustomerVerified?: boolean;
}

