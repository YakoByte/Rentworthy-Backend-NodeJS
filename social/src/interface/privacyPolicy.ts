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
    query: {
        _id: string,
    }
}

export interface privacyPolicy extends Document { 
    title: string;
    image: Types.ObjectId;
    description: string;
}

export interface privacyPolicyRequest {
    title: string;
    image: string;
    description: string;
}

export interface privacyPolicyUpdateRequest {
    _id: string;
    title?: string;
    image?: string;
    description?: string;
}

export interface privacyPolicyGetRequest {
    _id?: string
    user: {
        _id: string;
        roleName: string;
        email: string;
    };
    title?: string;
    image?: string;
    description?: string;
}

export interface privacyPolicyDeleteRequest {
    _id: string
}
