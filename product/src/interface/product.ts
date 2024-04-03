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
    brand: string;
    min_qty: number;
    max_qty: number;
    min_price: number;
    max_price: number;
    userId: Types.ObjectId;
    isDeleted?: boolean;
    interactionCount?: number;
    viewCount?: number;
    isVerified?: string;
    approvedBy?: Types.ObjectId;
    categoryId: Types.ObjectId;
    subCategoryId: Types.ObjectId;
    isExtended?: boolean;
    rentedType: string;
    quantity: number;
    price: number;
    thumbnail: Types.ObjectId
    address: string
    location: {
        type: string;
        coordinates: number[];
    }
    isDeliverable?: boolean;
    Distance?: number; 
    link: string
    cancellationPolicyIds: Types.ObjectId[];
    rentingDate: {
        startDate: Date;
        endDate: Date;
    };
    cancellationTimeLimit?: number;
    rejectionReason? :string;
}

export interface productRequest {
    _id?: "string"
    name: any;
    images: [string];
    description?: string;
    isShow?: boolean;
    userId: string;
    quantity: any;
    price: number;
    thumbnail: string;
    address: string
    location: {
        type: string;
        coordinates: number[];
    }
    isDeliverable?: boolean;
    Distance?: number; 
    rentingDate: {
        startDate: string;
        endDate: string;
    };
    link: string;
    cancellationTimeLimit?: number;
    rejectionReason? :string;
}

export interface productUpdateRequest {
    _id: string
    name?: string;
    images?: [string];
    description?: string;
    isShow?: boolean;
    userId?: string;
    isVerified?: string;
    approvedBy?: string;
    quantity?: number;
    price?: number;
    thumbnail?: Types.ObjectId
    address?: string
    location?: {
        type?: string;
        coordinates?: number[];
    }
    isDeliverable?: boolean;
    Distance?: number; 
    link?: string;
    cancellationTimeLimit?: number;
    rejectionReason? :string;
}

// for approve Product
export interface productApproveRequest {
    _id: string
    isVerified: string;
    approvedBy: string;
    rejectionReason? :string;
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
    ownerId?: string;
    roleName?: string;
    lat?: string;
    long?: string;
    sort?: string;
    price?: string;
    cancellationTimeLimit?: number;
    rejectionReason?: string;
    isVerified?: boolean;
    isRejected?: boolean;
    isPending?: boolean;
}

export interface productSorting {
    sort?: string;
    price?: string;
    quantity?: string;
    createdAt?: string;
    userId?: string;
    skip: number;
    limit: number;
    _id?: string
    search?: string;
    categoryId?: string;
    subCategoryId?: string;
    ownerId?: string;
    roleName?: string;
    lat?: string;
    long?: string;
}

// for delete Product
export interface productDeleteRequest {
    _id?: string
    userId?: string;
}