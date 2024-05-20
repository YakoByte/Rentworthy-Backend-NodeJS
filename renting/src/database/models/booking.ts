import mongoose, { Schema, Document, Types } from "mongoose";

import { Booking } from "../../interface/booking";

const bookingSchema: Schema = new Schema<Booking>(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: true,
        },
        BookingDate: [{
            date: {
                type: Date,
                required: true,
            }
        }],
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
        isBlocked: {
            type: Boolean,
            default: false,
        },
        blockedReason: {
            type: String,
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
            default: 0,
        },
        totalAmount: {
            type: Number,
            required: true,
            default: 0,
        },
        expandId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "expand",
        },
        isAccepted: {
            type: Boolean,
            default: false,
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
        postRentalScreening: [{
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
        statusHistory: [{
            type: String,
            default: "Requested",
            enum: ["Requested", "Confirmed", "Rejected", "Shipped", "Delivered", "Returned", "Cancelled", "Blocked", "UnBlocked"]
        }],
        status: {
            type: String,
            default: "Requested",
            enum: ["Requested", "Confirmed", "Rejected", "Shipped", "Delivered", "Returned", "Cancelled", "Blocked", "UnBlocked"]
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
        rentalReview: {
            type: String
        },
        ownerReview: {
            type: String
        }
    },
    { timestamps: true }
);

const Bookings = mongoose.model<Booking>("Booking", bookingSchema);

export default Bookings;
