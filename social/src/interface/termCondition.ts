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

export interface termCondition extends Document { 
    title: string;
    image: Types.ObjectId;
    description: string;
}

export interface termConditionRequest {
    title: string;
    image: string;
    description: string;
}

export interface termConditionUpdateRequest {
    _id: string;
    title?: string;
    image?: string;
    description?: string;
}

export interface termConditionGetRequest {
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

export interface termConditionDeleteRequest {
    _id: string
}
