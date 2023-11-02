import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    user?: {
        _id: string;
    };
    file?: any;
}
export interface Address extends Document {
    userId: Types.ObjectId;
    phoneNo: number;
    zipcode: string;
    state: string;
    city: string;
    fullAddress: string;
    unitNumber: string;
    typeOfAddress: string;
    isdefault?: boolean;
    isDeleted?: boolean;
}

export interface addressRequest {
    _id?: string;
    userId: Types.ObjectId;
    phoneNo: number;
    zipcode: string;
    state: string;
    city: string;
    fullAddress: string;
    unitNumber: string;
    typeOfAddress: string;
    isdefault: boolean;
} 