import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface postAuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    user?: {
        _id: string;
    };
    headers: any;
    files?: any;
    body: {
        productId: string;
        // paymentMethodId: string
        // paymentIntentId: string
        preRentalScreening: {
            question: string;
            answer: string;
            ansBoolean: boolean;
            images: string[];
        }[];
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
    user?: {
        _id: string;
    };
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

export interface Booking extends Document {
    productId: Types.ObjectId;
    preRentalScreening: {
        question: string;
        answer: string;
        ansBoolean: boolean;
        image: string;
    }[];
    startDate: Date;
    endDate: Date;
    userId: Types.ObjectId;
    paymentId?: Types.ObjectId;
    quantity: number;
    isDeleted?: boolean;
    images: string[];
    addressId: Types.ObjectId;
    price: number;
    totalAmount: number;
    expandId?: Types.ObjectId;
    isAccepted?: boolean;
    status?: string;
    acceptedBy?: string;
}

export interface bookingRequest {
    _id?: string;
    productId: string;
    // paymentMethodId: string
    // paymentIntentId: string
    status?: string;
    startDate: Date;
    endDate: Date;
    preRentalScreening: {
        question: string;
        answer: string;
        ansBoolean: boolean;
        images: string[];
    }[];
    userId: string;
    quantity: string;
    images: string[];
    addressId: string;
    price: string;
    totalAmount: string;
    expandId?: string;
}

export interface bookingRequestWithPayment {
    _id?: string;
    productId: string;
    // paymentId: Types.ObjectId;
    // paymentMethodId: string
    // paymentIntentId: string
    status?: string;
    startDate: Date;
    endDate: Date;
    userId: string;
    quantity: string;
    images: string[];
    addressId: string;
    price: string;
    totalAmount: string;
    expandId?: string;
}

export interface bookingUpdateRequest {
    _id: string,
    isAccepted: boolean,    // true or false
    acceptedBy: string
}

// for get booking
export interface bookingGetRequest {
    _id?: string
    user: {
        _id: string;
        roleName: string;
        email: string;
    };
    page?: string;
    limit?: string;
    productId?: string;
    startDate?: string;   // pending, accepted, rejected, completed
    endDate?: string;
    status?: string;      // activeBooking, requests, rented, requested
}

export interface recentBookingGetRequest {
    _id?: string
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
    status?: string;      // pending, accepted, rejected, completed
}

// for delete booking
export interface bookingDeleteRequest {
    _id: string
}