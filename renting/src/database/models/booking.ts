import mongoose, { Schema, Document, Types } from "mongoose";

import { Booking } from "../../interface/booking";

const bookingSchema: Schema = new Schema<Booking>(
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
        paymentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "payment",
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
        preRentalScreening: [{
            question: {
                type: String,
                required: true,
            },
            answer: {
                type: String,
                required: true,
            },
            ansBoolean: {
                type: Boolean,
                required: true,
            },
            images: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "image",
            }],
        }],
        status: {
            type: String,
            default: "Requested",
            enum: ["Requested", "Confirmed", "Rejected", "Shipped", "Delivered", "Returned", "Cancelled"]
        },
        acceptedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: false,
        },
    },
    { timestamps: true }
);

const Bookings = mongoose.model<Booking>("Booking", bookingSchema);

export default Bookings;
