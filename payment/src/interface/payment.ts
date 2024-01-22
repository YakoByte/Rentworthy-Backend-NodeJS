import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    user?: {
        _id: string;
    };
}

export interface Payment extends Document {
    productId: Types.ObjectId;
    bookingId: Types.ObjectId;
    paymentIntentId: string
    paymentMethodId: string
    userId: Types.ObjectId;
    quantity: number;
    price: number;
}

export interface postAuthenticatedRequest extends Request {
    user?: {
        _id: string;
    };
    body: {
        amount: number;
        currency: string;
    }
}

export interface confirmIntentRequest extends Request {
    user?: {
        _id: string;
    };
    body: {
        paymentMethodId: string;
        productId: Types.ObjectId;
        paymentIntentId: string
        userId: Types.ObjectId;
        quantity: number;
        price: number;
    }
}

export interface PaymentDetails {
    amount: number;
    currency: string;
}

export interface PaymentConfirmDetails {
    paymentMethodId: string;
    vendorAmount?: number;
    productId: Types.ObjectId;
    paymentIntentId: string;
    userId: Types.ObjectId;
    quantity: number;
    price: number;
}

export interface PaymentMethodDetails {
    card: {
        name: string;
        number: string;
        exp_month: string;
        exp_year: string;
        cvc: string;
    };
    customer_id: string;
    billing_details: {
        name: string;
        email: string;
        address: {
            line1: string;
            line2?: string;
            city: string;
            state: string;
            postal_code: string;
            country: string;
        };
    };
}

export interface PaymentCount {
    productId?: string;
    userId?: string;
}