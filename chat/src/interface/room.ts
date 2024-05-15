import exp from 'constants';
import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    user?: any;
}

export interface Room extends Document {
    productId: Types.ObjectId;
    senderId: Types.ObjectId;
    bookingId: Types.ObjectId;
    receiverId: Types.ObjectId;
    isDeleted: boolean;
    isActive: boolean;
}

export interface roomData {
    _id: string;
    productId: Types.ObjectId;
    bookingId: Types.ObjectId;
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    isDeleted: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface roomRequest {
    _id?: string;
    productId?: string;
    bookingId?: string;
    senderId?: string;
    receiverId?: string;
    isDeleted?: boolean;
    unRead?: string;
    lastMessage?: boolean;
}

export interface getRoomRequest {
    _id?: string;
    productId?: string;
    bookingId?: string;
    senderId?: string;
    receiverId?: string;
    isDeleted?: boolean;
    isActive?: boolean;
    unRead?: string;
    lastMessage?: boolean;
    roomId?: string;
}

export interface deleteRoomRequest {
    _id: string;
}
