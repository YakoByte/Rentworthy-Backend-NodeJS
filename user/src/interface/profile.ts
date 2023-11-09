import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    user?: {
        _id: string;
        userName: string;
        roleName: string;
    };
    file?: any;
}
export interface Profile extends Document {
    userId: Types.ObjectId;
    isActive?: boolean;
    isBlocked?: boolean;
    isReported?: boolean;
    isDeleted?: boolean;
    profileImage: string;
    locationId?: Types.ObjectId;
}

export interface profileRequest {
    // _id?: string;
    userId: string;
    isActive?: boolean;
    isBlocked?: boolean;
    isReported?: boolean;
    isDeleted?: boolean;
    profileImage: string;
    locationId?: Types.ObjectId;
}

//get profiles

export interface getProfileRequest {
    userId?: string;
    isDeleted?: boolean;
    isActive?: boolean;
    isBlocked?: boolean;
}