import mongoose, { Schema, Document, Types } from "mongoose";

import { ExpandDate } from "../../interface/expandDate";

const expandDateSchema: Schema = new Schema<ExpandDate>(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
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
        isDeleted: {
            type: Boolean,
            default: false,
        },
        images: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "image",
                required: true,
            },
        ],
        addressId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "address",
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        isAccepted: {
            type: Boolean,
        },
        acceptedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: false,
        },
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "booking",
            required: false,
        },
    },
    { timestamps: true }
);

const ExpandDates = mongoose.model<ExpandDate>("ExpandDate", expandDateSchema);

export default ExpandDates;
