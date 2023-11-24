import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    // Additional properties or methods specific to AuthenticatedRequest
    user?: any;
    files?: any;
    headers: any;
}

export interface ProductReservation extends Document {
    productId: Types.ObjectId
    customerRes: [number]
    selfRes: [number]
    availableDates: [number]
    month: number
    year: number
}

export interface productReservationRequest {
    productId: string
    startDate: string
    endDate: string
}

export interface updateProductReservation {
    productId: string
    startDate: string
    endDate: string
}

export interface getAvailables {
    productId: string
}
