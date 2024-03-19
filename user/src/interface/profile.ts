import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    user?: {
        _id: string;
        userName: string;
        roleName: string;
    };
    headers: any;
    file?: any;
}
export interface Profile extends Document {
    userId: Types.ObjectId;
    userName?: string;
    userDesc?: string;
    countryCode?: number;
    phoneNo?: number;
    email?: string;
    isActive?: boolean;
    isBlocked?: boolean;
    isReported?: boolean;
    isDeleted?: boolean;
    profileImage: Types.ObjectId;
    locationId?: Types.ObjectId;
    recommendation?: boolean;
    updatesOrOffers?: boolean;
    language?: string;
    level: number;
    points: number;
}

export interface profileRequest {
    _id?: string;
    userId: string;
    userName?: string;
    userDesc?: string;
    countryCode?: number;
    phoneNo?: number;
    email?: string;
    isActive?: boolean;
    isBlocked?: boolean;
    isReported?: boolean;
    isDeleted?: boolean;
    profileImage: string;
    locationId?: Types.ObjectId;
    points?: number;
    level?: number;
}

export interface updateProfile {
    _id?: string;
    userId?: string;
    userName?: string;
    userDesc?: string;
    countryCode?: number;
    phoneNo?: number;
    email?: string;
    isActive?: boolean;
    isBlocked?: boolean;
    isReported?: boolean;
    isDeleted?: boolean;
    profileImage?: string;
    locationId?: Types.ObjectId;
}

//get profiles

export interface getProfileRequest {
    _id?: string;
    userId?: string;
    isDeleted?: boolean;
    isActive?: boolean;
    isBlocked?: boolean;
    limit?: number;
    page?: number;
    criteria?: string;
}