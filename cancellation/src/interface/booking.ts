import { Document, Types } from "mongoose";

export interface Booking extends Document {
    productId: Types.ObjectId;
    preRentalScreening: {
        question: string;
        answer: string;
        ansBoolean: boolean;
        images: string;
    }[];
    postRentalScreening: {
        question: string;
        answer: string;
        ansBoolean: boolean;
        images: string;
    }[];
    BookingDate: {
        Date: Date,
    }[];
    userId: Types.ObjectId;
    paymentId?: Types.ObjectId;
    quantity: number;
    isDeleted?: boolean;
    images: string[];
    addressId: Types.ObjectId;
    price: number;
    totalAmount: number;
    expandId?: Types.ObjectId;
    isAccepted?: boolean;
    isBlocked?: boolean;
    blockedReason?: string; 
    statusHistory?: string[];
    status?: string;
    bookingTime:Date;
    acceptedBy?: string;
    rentalReview?: string;
    ownerReview?: string;
    isExtended?: boolean;
    extendedPrice?: number;
}