import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    user?: any;
    files?: any;
    headers: any;
}

export interface Complain extends Document {
    userId: Types.ObjectId;
    productId: Types.ObjectId;
    name: string;
    images: [Types.ObjectId];
    description: string;
    location: {
        type: string;
        coordinates: number[];
    };
    isDeleted: boolean;
}

export interface ComplainRequest {
    _id?: "string"
    userId?: Types.ObjectId;
    productId?: Types.ObjectId;
    name?: string;
    images?: [Types.ObjectId];
    description?: string;
    location?: {
        type?: string;
        coordinates?: number[];
    };
}
export interface ComplainUpdateRequest {
    _id: string
    userId?: Types.ObjectId;
    productId?: Types.ObjectId;
    name?: string;
    images?: [Types.ObjectId];
    description?: string;
    location?: {
        type?: string;
        coordinates?: number[];
    }
}

// for get Complain 
export interface ComplainGetRequest {
    _id?: string
    userId?: Types.ObjectId;
    productId?: Types.ObjectId;
    name?: string;
    images?: [Types.ObjectId];
    description?: string;
    lat?: string;
    long?: string;
    page?: string;
    limit?: string;
}

// for delete Complain
export interface ComplainDeleteRequest {
    _id?: string
    userId?: string;   
    productId?: Types.ObjectId;
}