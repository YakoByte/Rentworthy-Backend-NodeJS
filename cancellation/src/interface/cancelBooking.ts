import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface postAuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    user?: {
        _id: string;
    };
    body: {
        productId: Types.ObjectId;
        bookingId: Types.ObjectId;
        description: string;
        userId: Types.ObjectId;
        cancellationPolicyId: Types.ObjectId;
        cancellationCharges: string;
        cancellationChargesType: string;
        cancellationHours: string;
        cancellationDate: Date;
        cancellationAmount: string;
    }

}

export interface updateAuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    user?: {
        _id: string;
    };
    query: {
        _id: string,
    }
    body: {
        status: string;
        isApproved?: boolean;
        approvedBy?: string;
    }

}

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
    user?: {
        _id: string;
    };
    query: {
        _id?: string;
        user?: {
            _id: string;
            roleName: string;
            email: string;
        };
        page?: string;
        limit?: string;
    },
}

export interface CancelBooking extends Document {
    productId: Types.ObjectId;
    bookingId: Types.ObjectId;
    description: string;
    userId: Types.ObjectId;
    cancellationPolicyId: Types.ObjectId;
    cancellationCharges: string;
    cancellationChargesType: string;
    cancellationHours: string;
    cancellationDate: Date;
    cancellationAmount: string;
    status: string;
    isApproved: boolean;
    approvedBy: Types.ObjectId;
}
export interface approveAuthenticatedRequest extends Request {
    user?: {
        _id: string;
    };
    query: {
        _id: string,
    };
    body: {
        isApproved: boolean;
        approvedBy: string
        status?: string;
    }
}

export interface cancelBookingRequest {
    _id?: string;
    productId: Types.ObjectId;
    bookingId: Types.ObjectId;
    description: string;
    userId: Types.ObjectId;
    cancellationPolicyId: Types.ObjectId;
    cancellationCharges: string;
    cancellationChargesType: string;
    cancellationHours: string;
    cancellationDate: Date;
    cancellationAmount: string;
}

export interface cancelBookingUpdateRequest {
    _id: string,
    status: string;
    isApproved?: boolean;
    approvedBy?: string;
}

// for get cancelBooking
export interface cancelBookingGetRequest {
    _id?: string
}
// for delete cancelBooking
export interface cancelBookingDeleteRequest {
    _id: string
}