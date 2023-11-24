import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    user?: {
        _id: string;
    };
    query: {
        _id?: string;
        userId?: string;
    };
}
export interface Address extends Document {
    userId: Types.ObjectId;
    phoneNo: number;
    zipcode: string;
    state: string;
    city: string;
    fullAddress: string;
    fullName: string;
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
    fullName: string;
    unitNumber: string;
    typeOfAddress: string;
    isdefault?: boolean;
}

export interface getAddressRequest {
    _id?: string;
    userId?: string;

}