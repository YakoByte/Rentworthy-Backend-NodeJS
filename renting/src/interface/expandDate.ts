import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface postAuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    user?: {
        _id: string;
    };
    files?: any;
    body: {
        productId: string;
        startDate: Date;
        endDate: Date;
        userId: string;
        quantity: string;
        images: string[];
        addressId: string;
        price: string;
        totalAmount: string;
        isAccepted?: boolean;
        acceptedBy?: string;
        bookingId?: Types.ObjectId;
    }

}

export interface approveAuthenticatedRequest extends Request {
    user?: {
        _id: string;
    };
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
    user?: any;
    query: {
        _id?: string;
        userId?: string;
        user?: {
            _id: string;
            roleName: string;
            email: string;
        };
        page?: string;
        limit?: string;
        productId?: string;
        startDate?: string;
        endDate?: string;
    },
}

export interface ExpandDate extends Document {
    productId: Types.ObjectId;
    startDate: Date;
    endDate: Date;
    userId: Types.ObjectId;
    quantity: number;
    isDeleted?: boolean;
    images: string[];
    addressId: Types.ObjectId;
    price: number;
    totalAmount: number;
    expandId?: Types.ObjectId;
    isAccepted?: boolean;
    acceptedBy?: string;
    bookingId?: Types.ObjectId;
}

export interface expandDateRequest {
    _id?: string;
    productId: string;
    startDate: Date;
    endDate: Date;
    userId: string;
    quantity: string;
    images: string[];
    addressId: string;
    price: string;
    totalAmount: string;
    bookingId?: Types.ObjectId;
}

export interface expandDateUpdateRequest {
    _id: string,
    isAccepted: boolean,    // true or false
    acceptedBy: string
}

// for get expandDate
export interface expandDateGetRequest {
    _id?: string
    user: {
        _id: string;
        roleName: string;
        email: string;
    };
    page?: string;
    limit?: string;
    productId?: string;
    startDate?: string;
    endDate?: string;
}

// for delete expandDate
export interface expandDateDeleteRequest {
    _id: string
}