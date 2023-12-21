import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    user?: {
        _id: string;
    };
    headers: any;
    query: {
        _id?: string;
        title?: string;
        image?: string;
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

export interface aboutUS extends Document {
    title: string;
    image: Types.ObjectId;
    description: string;
    isDeleted: boolean;
}

export interface aboutUSRequest {
    title: string;
    image: string;
    description: string;
}

export interface aboutUSUpdateRequest {
    _id: string;
    title?: string;
    image?: string;
    description?: string;
}

export interface aboutUSGetRequest {
    _id?: string
    title?: string;
    description?: string;
}

export interface aboutUSDeleteRequest {
    _id: string
}
