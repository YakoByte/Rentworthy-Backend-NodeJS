import mongoose, { Schema, Document, Types } from "mongoose";

export interface Product extends Document {
    name: string;
    images: [Types.ObjectId];
    description: string;
    isActive?: boolean;
    brand: string;
    min_qty: number;
    max_qty: number;
    min_price: number;
    max_price: number;
    userId: Types.ObjectId;
    isDeleted?: boolean;
    viewCount?: number;
    isVerified?: string;
    approvedBy?: Types.ObjectId;
    categoryId: Types.ObjectId;
    subCategoryId: Types.ObjectId;
    isExtended?: boolean;
    rentedType: string;
    quantity: number;
    price: number;
    thumbnail: Types.ObjectId
    address: string
    location: {
        type: string;
        coordinates: number[];
    }
    isDeliverable?: boolean;
    Distance?: number; 
    link: string
    cancellationPolicyIds: Types.ObjectId[];
    cancellationTimeLimit?: number;
    rejectionReason? :string;
    numberOfBooking?: number;
}
