import { Request } from 'express';
import mongoose, { Schema, Document, Types, ObjectId } from "mongoose";

export interface postAuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    user?: {
        _id: string;
    };
    body: {
        desc: string;
        title: string;
        type: string;
        receiverId: string;
    }

}

// export interface approveAuthenticatedRequest extends Request {
//     user?: {
//         _id: string;
//     };
//     body: {
//         isAccepted: boolean;
//         _id: string,
//         acceptedBy?: string
//     }
// }

export interface deleteAuthenticatedRequest extends Request {
    user?: {
        _id: string;
    };
    query: {
        _id: string,
    }
}

export interface AuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    files?: any;
    headers: any;
    user?: {
        _id: string;
    };
    query: {
        _id?: string;
        user?: string;
    },
}

export interface Notification extends Document {
    desc: string;
    isRead: boolean;
    title: string;
    type: string;
    userId: Types.ObjectId;
    receiverId: Types.ObjectId;
    isDeleted: boolean;
}

export interface notificationRequest {
    _id?: string;
    desc?: string;
    isRead?: boolean;
    title?: string;
    type?: string;
    userId?: string;
    receiverId?: string;
    isDeleted?: boolean;
}

export interface notificationUpdateRequest {
    _id: string;
    isRead: boolean;
}

// for get notification
export interface notificationGetRequest {
    _id?: string
    user?: string
    page?: string
    limit?: string
    receiverId?: string
}

// for delete notification
export interface notificationDeleteRequest {
    _id: string
}