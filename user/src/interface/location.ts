import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";
// interface for req.user, req.query, req.file

export interface AuthenticatedRequest extends Request {
    user?: {
        _id: string;
    };
    file?: any;
}
export interface Location extends Document {
    userId: Types.ObjectId;
    location: {
        type: string;
        coordinates: number[];

    };

}

export interface locationRequest {
    _id?: string;
    userId: string;
    location: {
        type: string;
        coordinates: number[];

    };
}