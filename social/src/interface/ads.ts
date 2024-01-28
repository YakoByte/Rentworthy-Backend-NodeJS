import { Request } from 'express';
import mongoose, { Schema, Document, Types, ObjectId } from "mongoose";

export interface postAuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    user?: {
        _id: string;
    };
    body: {
        categoryId?: string;
        subCategoryId?: string;
        productId?: string;
        description?: string;
        location?: {
            type: string;
            coordinates: number[];
        };
        address?: {
            area?: string;
            city?: string;
            state?: string;
            country?: string;
        };
        brand?: string;
        distance?: number;
        isGlobal?: boolean;
        startDate?: Date;
        endDate?: Date;
        startTime?: string;
        endTime?: string;
        url?: string;
        userId?: string;
        images?: [Types.ObjectId];
    }

}

export interface approveAuthenticatedRequest extends Request {
    user?: {
        _id: string;
    };
    headers: any;
    body: {
        isAccepted: boolean;
        _id: string,
        acceptedBy?: string
    }
}

export interface deleteAuthenticatedRequest extends Request {
    user?: {
        _id: string;
    };
    query: {
        _id: string,
    }
}

export interface AuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    files?: any;
    headers: any;
    user?: {
        _id: string;
    };
    query: {
        _id?: string;
        user?: string;
        page?: string;
        limit?: string;
        startDate?: string;
        endDate?: string;
        categoryId?: string;
        subCategoryId?: string;
        productId?: string;
        long: string;
        lat: string;
        distance: string;
        city?: string;
        state?: string;
        country?: string;
    },
}

export interface Ads extends Document {
    categoryId: Types.ObjectId;
    subCategoryId: Types.ObjectId;
    userId: Types.ObjectId;
    title: string;
    brand: string;
    min_qty: number;
    max_qty: number;
    min_price: number;
    max_price: number;
    description: string;
    productId: Types.ObjectId;
    isDeleted: boolean;
    images?: [Types.ObjectId]
    location: {
        type: string;
        coordinates: number[];
    };
    distance: number;
    isGlobal: boolean;
    address: {
        area: string;
        city: string;
        state: string;
        country: string;
    };
    startDate: Date;
    endDate: Date;
    startTime: string;
    endTime: string;
    url: string;
    isApproved: boolean;
    approvedBy: Types.ObjectId;
}

export interface adsRequest {
    _id?: string;
    categoryId?: string;
    subCategoryId?: string;
    productId?: string;
    description?: string;
    location?: {
        type: string;
        coordinates: number[];
    };
    address?: {
        area?: string;
        city?: string;
        state?: string;
        country?: string;
    };
    isApproved?: boolean;
    approvedBy?: string;
    distance?: number;
    isGlobal: boolean;
    startDate?: Date;
    endDate?: Date;
    startTime?: string;
    endTime?: string;
    url?: string;
    userId?: string;
    images?: [Types.ObjectId];
}

export interface adsUpdateRequest {
    _id: string;
    categoryId?: string;
    subCategoryId?: string;
    productId?: string;
    description?: string;
    isApproved?: boolean;
    approvedBy?: string;
    location?: {
        type: string;
        coordinates: number[];
    };
    address?: {
        area?: string;
        city?: string;
        state?: string;
        country?: string;
    };
    distance?: number;
    isGlobal?: boolean;
    startDate?: Date;
    endDate?: Date;
    startTime?: string;
    endTime?: string;
    url?: string;
    userId?: string;
    images?: [string];
}

// for get ads
export interface adsGetRequest {
    _id?: string
    user: {
        _id: string;
        roleName: string;
        email: string;
    };
    page?: string;
    limit?: string;
    startDate?: string;
    endDate?: string;
    userId?: string;
    categoryId?: string;
    subCategoryId?: string;
    productId?: string;
    long?: string;
    lat?: string;   
    distance?: string;
    city?: string;
    state?: string;
    country?: string;
}

// for delete ads
export interface adsDeleteRequest {
    _id: string
}