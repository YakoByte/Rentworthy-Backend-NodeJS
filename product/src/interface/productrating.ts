import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    user?: any;
    headers: any;
}

export interface ProductRating extends Document {
    userId: Types.ObjectId;
    productId: Types.ObjectId;
    isDeleted?: boolean;
    rating: number

}

export interface productRatingRequest {
    userId: string;
    productId: string;
    rating: number
}

export interface getProductRatingRequest {
    userId?: string;
    productId?: string;
}

export interface getAllProductRating {
    page?: number;
    limit?: number;
    productId: string;
}