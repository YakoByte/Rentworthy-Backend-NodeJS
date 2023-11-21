import mongoose, { Schema, Document, Types } from "mongoose";

import { CancelBooking } from "../../interface/cancelBooking";

const cancelBookingSchema: Schema = new Schema<CancelBooking>(
    {
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "booking",
            required: true,
        },
        cancellationPolicyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "cancellationPlan",
            required: true,
        },
        cancellationCharges: {
            type: String,
            required: true,
        },
        cancellationChargesType: {
            type: String,
            required: true,
        },
        cancellationDate: {
            type: Date,
            required: true,
        },
        cancellationHours: {
            type: String,
            required: true,
        },
        cancellationAmount: {
            type: String,
            required: true,
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "paymentPending", "paymentProcessing", "paymentFailed", "paymentSuccess"],
            required: true,
        },
        isApproved: {
            type: Boolean,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: true,
        },
    },
    { timestamps: true }
);

const CancelBookings = mongoose.model<CancelBooking>("CancelBooking", cancelBookingSchema);

export default CancelBookings;
