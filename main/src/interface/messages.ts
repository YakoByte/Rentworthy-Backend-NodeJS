import exp from 'constants';
import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    user?: any;
}

export interface Message extends Document {
    senderId: Types.ObjectId;
    message: string;
    receiverId: Types.ObjectId;
    messageType: string;
    roomId: Types.ObjectId;
    isSeen: boolean;
    isDeleted: boolean;
    isActive: boolean;
}

export interface messageData {
    _id: string;
    senderId: Types.ObjectId;
    message: string;
    receiverId: Types.ObjectId;
    messageType: string;
    roomId: Types.ObjectId;
    isSeen: boolean;
    isDeleted: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface messageRequest {
    senderId?: string;
    receiverId?: string;
    userId?: string;
    message?: string;
    messageType?: string;
    roomId?: string;
    isSeen?: boolean;
    isDeleted?: boolean;
}

export interface getMessageRequest {
    _id?: string;
    userId?: string;
    senderId?: string;
    message?: string;
    receiverId?: string;
    messageType?: string;
    roomId?: string;
    isDeleted?: boolean;
}

export interface deleteMessageRequest {
    _id: string;
}
