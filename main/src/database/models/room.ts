import mongoose, { Schema, Document, Types } from "mongoose";

import { Room } from "../interface/room";

const roomSchema: Schema = new Schema<Room>(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor",
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
