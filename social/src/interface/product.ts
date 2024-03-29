import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    user?: any;
    files?: any;
    headers: any;
}

export interface Product extends Document {
    name: string;
    images: [Types.ObjectId];
    description: string;
    isActive?: boolean;
    userId: Types.ObjectId;
    isDeleted?: boolean;
    isVerified?: string;
    approvedBy?: Types.ObjectId;
    categoryId: Types.ObjectId;
    subCategoryId: Types.ObjectId;
    isExtended?: boolean;
    rentedType: string;
    quantity: number;
    price: number;
    rentingDate: {
        startDate: Date;
        endDate: Date;
    };

}

export interface productRequest {
    _id?: "string"
    name: string;
    images: [string];
    description?: string;
    isShow?: boolean;
    userId: string;
    quantity: number;
    price: number;
}
export interface productUpdateRequest {
    _id: string
    name?: string;
    images?: [Types.ObjectId];
    description?: string;
    isShow?: boolean;
    userId?: string;
    isVerified?: string;
    approvedBy?: string;
    quantity?: number;
    price?: number;
}

// for approve Product
export interface productApproveRequest {
    _id: string
    isVerified: string;
    approvedBy: string;
}

// for get Product 
export interface productGetRequest {
    _id?: string
    search?: string;
    page?: string;
    limit?: string;
    categoryId?: string;
    subCategoryId?: string;
    userId?: string;
    images?: [string];
}

// for delete Product
export interface productDeleteRequest {
    _id?: string
    userId?: string;
}