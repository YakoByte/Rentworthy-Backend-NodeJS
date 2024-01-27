import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    user?: {
        _id: string;
    };
}

export interface getCountAuthenticatedRequest extends Request {
    user?: {
        _id: string;
    };
    query: {
        criteria: string,
    }
}

export interface Payment extends Document {
    productId: Types.ObjectId;
    bookingId: Types.ObjectId;
    paymentIntentId: string
    paymentMethodId: string
    userId: Types.ObjectId;
    quantity: number;
    amount: number;
    isDeleted: boolean;
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
        paymentIntentId: string
        productId: Types.ObjectId;
        userId: Types.ObjectId;
        amount: number;
        quantity: number;
        currency: string;
    }
}

export interface PaymentDetails {
    amount: number;
    currency: string;
}

export interface PaymentConfirmDetails {
    paymentMethodId: string;
    paymentIntentId: string;
    amount: number;
    productId: Types.ObjectId;
    userId: Types.ObjectId;
    quantity: number;
    currency: string;
}

export interface PaymentMethodDetails {
    card?: {
        name: string;
        number: string;
        exp_month: string;
        exp_year: string;
        cvc: string;
    };
    customer_id: string;
}

export interface PaymentChargeDetails {
    email?: string;
    customer_id: string;
    amount: number;
    currency?: string;
}

export interface PaymentCount {
    productId?: string;
    userId?: string;
}