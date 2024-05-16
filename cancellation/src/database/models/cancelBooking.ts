import mongoose, { Schema, Document, Types } from "mongoose";

import { CancelBooking } from "../../interface/cancelBooking";

const cancelBookingSchema: Schema = new Schema<CancelBooking>(
    {
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "booking",
        },
        cancellationPolicyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "cancellationPlan",
        },
        cancellationCharges: {
            type: Number,
        },
        cancellationDate: {
            type: Date,
            required: true,
            default: new Date(),
        },
        cancellationAmount: {
            type: Number,
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        description: {
            type: String,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "paymentPending", "paymentProcessing", "paymentFailed", "paymentSuccess"],
            default: "pending",
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
        },
    },
    { timestamps: true }
);

const CancelBookings = mongoose.model<CancelBooking>("CancelBooking", cancelBookingSchema);

export default CancelBookings;
