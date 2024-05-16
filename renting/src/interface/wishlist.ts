import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    user?: any;
}

export interface Wishlist extends Document {
    productIds: Types.ObjectId[];
    userId: Types.ObjectId;
    isDeleted?: boolean;
}

export interface wishlistRequest {
    _id?: string;
    productIds: string;
    userId: string;
}
export interface wishlistUpdateRequest {
    _id?: string;
    userId: string;
}
export interface wishlistUpdatePayload {
    $push?: { productIds: string };
    $pull?: { productIds: string };
}
// for get wishlist 
export interface wishlistGetRequest {
    _id?: string
    userId?: string;
    page?: string;
    limit?: string;
}

// for delete wishlist
export interface wishlistDeleteRequest {
    _id?: string
    userId?: string;
}