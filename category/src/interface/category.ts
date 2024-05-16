import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    user?: any;
    headers: any;
    file?: any;
}

export interface Category extends Document {
    name: string;
    image: Types.ObjectId;
    description: string;
    isActive?: boolean;
    userId: Types.ObjectId;
    isDeleted?: boolean;
    isShow: boolean;
}

export interface categoryRequest {
    _id?: "string"
    name: string;
    image: string;
    description?: string;
    isShow?: boolean;
    userId: string;
}
export interface categoryUpdateRequest {
    _id?: string
    name?: string;
    image?: string;
    description?: string;
    isShow?: boolean;
    userId?: string;
}
// for get category 
export interface categoryGetRequest {
    _id?: string
    search?: string;
    page?: number;
    limit?: number;
}

// for delete category
export interface categoryDeleteRequest {
    _id?: string
    userId?: string;
}