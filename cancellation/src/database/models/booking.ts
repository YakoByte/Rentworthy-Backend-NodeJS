import mongoose, { Schema, Document, Types } from "mongoose";

import { Booking } from "../../interface/booking";

const categorySchema: Schema = new Schema<Booking>(
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
        expandId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "expand",
            required: false,
        },
        isAccepted: {
            type: Boolean,
        },
        bookingTime: {
            type: Date,
            required: true,
            default: new Date()
        },
        acceptedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: false,
        },
    },
    { timestamps: true }
);

const Bookings = mongoose.model<Booking>("Booking", categorySchema);

export default Bookings;
