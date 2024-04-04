import mongoose, { Schema, Document, Types } from "mongoose";

import { Room } from "../../interface/room";

const roomSchema: Schema = new Schema<Room>(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Rooms = mongoose.model<Room>("Room", roomSchema);

export default Rooms;
