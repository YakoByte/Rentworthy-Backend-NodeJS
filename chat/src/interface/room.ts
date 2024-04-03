import exp from 'constants';
import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    user?: {
        _id: string;
    };
}

export interface Room extends Document {
    productId: Types.ObjectId;
    userId: Types.ObjectId;
    bookingId: Types.ObjectId;
    vendorId: Types.ObjectId;
    isDeleted: boolean;
    isActive: boolean;
}

export interface roomData {
    _id: string;
    productId: Types.ObjectId;
    bookingId: Types.ObjectId;
    userId: Types.ObjectId;
    vendorId: Types.ObjectId;
    isDeleted: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface roomRequest {
    productId?: string;
    bookingId?: string;
    userId?: string;
    vendorId?: string;
    isDeleted?: boolean;
}

export interface getRoomRequest {
    _id?: string;
    productId?: string;
    bookingId?: string;
    userId?: string;
    vendorId?: string;
    isDeleted?: boolean;
    rentingId?: string;
    isActive?: boolean;
    unRead?: string;
    lastMessage?: boolean;
    roomId?: string;
}

export interface deleteRoomRequest {
    _id: string;
}
