import mongoose, { Schema, Document, Types } from "mongoose";

import { Payment } from "../../interface/payment";

const PaymentSchema: Schema = new Schema<Payment>(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
        },
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "booking",
        },
        subscriptionPlan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subscription",
        },
        paymentId: {
            type: String,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
        }
    },
    { timestamps: true }
);

const Payments = mongoose.model<Payment>("Payment", PaymentSchema);

export default Payments;
