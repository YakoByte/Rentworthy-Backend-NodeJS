import { Document, Types } from "mongoose";

export interface Booking extends Document {
    productId: Types.ObjectId;
    preRentalScreening: {
        question: string;
        answer: string;
        ansBoolean: boolean;
        image: string;
    }[];
    startDate: Date;
    endDate: Date;
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
    status?: string;
    acceptedBy?: string;
}
