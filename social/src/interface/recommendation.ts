import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    user?: any;
    headers: any;
}

export interface Recommendation extends Document { 
    userId: Types.ObjectId;
    subCategoryId: [Types.ObjectId];
}

export interface recommendationRequest {
    userId: string;
    subCategoryId: [string];
}
