import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    user?: any;
}

export interface SubCategory extends Document {
    name: string;
    image: Types.ObjectId;
    description: string;
    isActive?: boolean;
    userId: Types.ObjectId;
    isDeleted?: boolean;
    isShow: boolean;
    categoryId: Types.ObjectId;
}

export interface subCategoryRequest {
    _id?: "string"
    name: string;
    image: string;
    description?: string;
    isShow?: boolean;
    userId: string;
    categoryId: string;
}
export interface subCategoryUpdateRequest {
    _id?: string
    name?: string;
    image?: string;
    description?: string;
    isShow?: boolean;
    userId?: string;
    categoryId?: string;
}
// for get subCategory 
export interface subCategoryGetRequest {
    _id?: string
    search?: string;
    page?: number;
    limit?: number;
    categoryId?: string;
}

// for delete subCategory
export interface subCategoryDeleteRequest {
    _id?: string
    userId?: string;
}