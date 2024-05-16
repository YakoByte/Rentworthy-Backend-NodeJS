import mongoose, { Schema } from "mongoose";

import { adminADS } from "../../interface/adminADS";

const adminADSSchema: Schema = new Schema<adminADS>(
    {
        title: {
            type: String,
            required: true,
        },
        images: [
            {
              type: Schema.Types.ObjectId,
              ref: "image",
            },
        ],
        description: {
            type: String,
        },
        category: {
            type: String,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const adminADS = mongoose.model<adminADS>("adminADS", adminADSSchema);

export default adminADS;
