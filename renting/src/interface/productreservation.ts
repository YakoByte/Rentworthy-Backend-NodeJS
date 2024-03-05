import { Request } from 'express';
import mongoose, { Schema, Document, Types } from "mongoose";

export interface ProductReservation extends Document {
    productId: Types.ObjectId
    customerRes: [number]
    selfRes: [number]
    availableDates: [number]
    month: number
    year: number
}