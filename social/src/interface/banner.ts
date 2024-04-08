import { Request } from 'express';
import { Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    files?: any;
    user?: {
        _id: string;
    };
    headers: any;
    query: {
        _id?: string;
        title?: string;
        image?: string;
        description?: string;
        category?: string;
    },
}

export interface deleteAuthenticatedRequest extends Request {
    user?: {
        _id: string;
    };
    headers: any;
    query: {
        _id: string;
    }
}

export interface banner extends Document {
    title: string;
    images?: [Types.ObjectId];
    description: string;
    category?: string;
    isDeleted: boolean;
}

export interface bannerRequest {
    title: string;
    images: [Types.ObjectId];
    description: string;
    category?: string;
}

export interface bannerUpdateRequest {
    _id: string;
    title?: string;
    images?: [Types.ObjectId];
    description?: string;
    category?: string;
}

export interface bannerGetRequest {
    _id?: string
    title?: string;
    description?: string;
    category?: string;
    images?: [string];
}

export interface bannerDeleteRequest {
    _id: string
}
