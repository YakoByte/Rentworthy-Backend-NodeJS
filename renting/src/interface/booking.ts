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
        _id?: string;
        productId: string;
        preRentalScreening: {
            question: string;
            answer: string;
            ansBoolean: boolean;
            images: string[];
        }[];
        postRentalScreening: {
            question: string;
            answer: string;
            ansBoolean: boolean;
            images: string[];
        }[];
        BookingDate: string[];
        userId: string;
        quantity: string;
        images: string[];
        addressId: string;
        price: string;
        totalAmount: string;
        isAccepted?: boolean;
        acceptedBy?: string;
        rentalReview?: string;
        ownerReview?: string;
        status?: string;
    }

}

export interface approveAuthenticatedRequest extends Request {
    user?: {
        _id: string;
    };
    headers: any;
    files?: any;
    body: {
        isAccepted: boolean;
        _id: string,
        acceptedBy?: string
        status?: string; 
    }
}

export interface deleteAuthenticatedRequest extends Request {
    user?: {
        _id: string;
    };
    query: {
        _id: string,
        status?: string;
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
        BookingDate?: string;
        status?: string;
    },
}

export interface Booking extends Document {
    productId: Types.ObjectId;
    preRentalScreening: {
        question: string;
        answer: string;
        ansBoolean: boolean;
        images: string;
    }[];
    postRentalScreening: {
        question: string;
        answer: string;
        ansBoolean: boolean;
        images: string;
    }[];
    BookingDate: {
        Date: Date,
    }[];
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
    isBlocked?: boolean;
    blockedReason?: string; 
    statusHistory?: string[];
    status?: string;
    bookingTime?:Date;
    acceptedBy?: string;
    rentalReview?: string;
    ownerReview?: string;
    isExtended?: boolean;
    extendedPrice?: number;
}

export interface bookingRequest {
    _id?: string;
    productId: string;
    statusHistory?: string[];
    status?: string;
    BookingDate: string[];
    preRentalScreening: {
        question: string;
        answer: string;
        ansBoolean: boolean;
        images: string[];
    }[];
    postRentalScreening: {
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
    acceptedBy?: string;
    rentalReview?: string;
    ownerReview?: string;
    page?: string;
    limit?: string;
    isExtended?: boolean;
    extendedPrice?: number;
}

export interface expendDate {
    _id?: string;
    productId?: string;
    BookingDate: string[];
    userId?: string;
    quantity?: string;
    price?: string;
    isExtended?: boolean;
    extendedPrice?: number;
}

export interface bookingRequestWithPayment {
    _id?: string;
    productId: string;
    statusHistory?: string[];
    status?: string;
    BookingDate: string[];
    userId: string;
    quantity: string;
    images: string[];
    addressId: string;
    price: string;
    totalAmount: string;
    expandId?: string;
    isExtended?: boolean;
    extendedPrice?: number;
}

export interface bookingUpdateRequest {
    _id: string,
    isAccepted?: boolean,    // true or false
    acceptedBy?: string,
    rentalReview?: string;
    ownerReview?: string;
    isExtended?: boolean;
    extendedPrice?: number;
}

// for get booking
export interface bookingGetRequest {
    _id?: string
    user: {
        _id: string;
        roleName: string;
        email: string;
    };
    userId?: string;
    page?: string;
    limit?: string;
    productId?: string;
    BookingDate?: string; 
    statusHistory?: string[];
    status?: string;     
    rentalReview?: string;
    ownerReview?: string;
    isExtended?: boolean;
    extendedPrice?: number;
}

// for delete booking
export interface bookingDeleteRequest {
    _id: string
}