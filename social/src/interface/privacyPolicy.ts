import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    user?: any;
    files?: any;
    headers: any;
    query: {
        _id?: string;
        title?: string;
        description?: string;
    },
}

export interface deleteAuthenticatedRequest extends Request {
    user?: {
        _id: string;
    };
    headers: any;
    query: {
        _id: string,
    }
}

export interface privacyPolicy extends Document { 
    title: string;
    images?: [Types.ObjectId];
    description: string;
    isDeleted: boolean;
}

export interface privacyPolicyRequest {
    title: string;
    images?: [Types.ObjectId];
    description: string;
}

export interface privacyPolicyUpdateRequest {
    _id: string;
    title?: string;
    images?: [Types.ObjectId];
    description?: string;
}

export interface privacyPolicyGetRequest {
    _id?: string
    title?: string;
    images?: [string];
    description?: string;
}

export interface privacyPolicyDeleteRequest {
    _id: string
}
