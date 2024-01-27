import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    user?: {
        _id: string;
    };
}

export interface Image extends Document {
    imageName: string;
    mimetype: string;
    path: string;
    size: number;
    isActive: boolean;
    userId: Types.ObjectId;
    isDeleted: boolean;
}

export interface imageRequest {
    imageDetail: {
        originalname? : string;
        imageName?: string;
        mimetype: string;
        path: string;
        size: number;
    }
    userId: Types.ObjectId;
}

// multiple image upload

export interface imageRequests {
    imageDetails: Array<{
        filename: string;
        mimetype: string;
        path: string;
        size: number;
    }>
    userId: Types.ObjectId;
}


export interface imageDetail {
    imageName?: string;
    mimetype: string;
    path: string;
    size: number;
    isActive?: boolean;
    userId: Types.ObjectId;
    isDeleted?: boolean;
}

export interface GetImageRequest {
    _id?: string;
    imageName?: string,
    search?: string,
}