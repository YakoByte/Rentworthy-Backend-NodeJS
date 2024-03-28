import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface postAuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    user?: {
        _id: string;
    };
    body: {
        planName: string;
        description: string;
        cancellationCharges: string;
        cancellationChargesType: string;
        minimumCharges: string;
        maximumCancellationHours: string;
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
        planName?: string;
        description?: string;
        cancellationCharges?: string;
        cancellationChargesType?: string;
        minimumCharges?: string;
        maximumCancellationHours?: string;
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

export interface CancellationPlan extends Document {
    planName: string;
    description: string;
    cancellationCharges: number;
    cancellationChargesType: string;
    minimumCharges: number;
    maximumCancellationHours: number;
    isDeleted: boolean;
    createdBy: Types.ObjectId;
}

export interface cancellationPlanRequest {
    _id?: string;
    planName: string;
    description: string;
    cancellationCharges: string;
    cancellationChargesType: string;
    minimumCharges: string;
    maximumCancellationHours: string;
    createdBy: string;
}

export interface cancellationPlanUpdateRequest {
    _id: string,
    planName?: string;
    description?: string;
    cancellationCharges?: string;
    cancellationChargesType?: string;
    minimumCharges?: string;
    maximumCancellationHours?: string;
}

// // for get cancellationPlan
export interface cancellationPlanGetRequest {
    _id?: string
}
// // for delete cancellationPlan
export interface cancellationPlanDeleteRequest {
    _id: string
}