import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    user?: any;
    headers: any;
}

export interface ProductLike extends Document {
    userId: Types.ObjectId;
    productId: Types.ObjectId;
    isDeleted?: boolean;
    isFav: boolean

}

export interface productLikeRequest {
    userId: string;
    productId: string;
    isFav: boolean
}

export interface getProductLikeRequest {
    userId?: string;
    productId?: string;
}