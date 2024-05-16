import mongoose, { Schema, Document, Types } from "mongoose";

import { Location } from "../../interface/location";

const locationSchema: Schema = new Schema<Location>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
    },
    { timestamps: true }
);

const Locations = mongoose.model<Location>("Location", locationSchema);

export default Locations;
