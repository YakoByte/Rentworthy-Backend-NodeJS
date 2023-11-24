import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    user?: any;
    headers: any;
}

export interface ProductReview extends Document {
    userId: Types.ObjectId;
    productId: Types.ObjectId;
    isDeleted?: boolean;
    review: string

}

export interface productReviewRequest {
    userId: string;
    productId: string;
    review: number
}

export interface getProductReviewRequest {
    userId?: string;
    productId?: string;
}