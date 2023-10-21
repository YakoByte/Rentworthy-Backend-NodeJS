import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    user?: {
        _id: string;
    };
}

export interface userRequest extends Document {
    userName: string;
    phoneNo?: number;
    phoneCode?: string;
    email?: string;
    password: string;
    stripe?: string;
    roleId: Types.ObjectId;
    appleId?: string;
    location?: string;
    address: Types.ObjectId[];
    isGuest?: boolean;
    isAuthenticated?: boolean;
    isActive?: boolean;
    isBlocked?: boolean;
    isReported?: boolean;
    profileImage?: string;
    isDeleted?: boolean;
}