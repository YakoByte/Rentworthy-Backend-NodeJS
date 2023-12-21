import mongoose, { Schema } from "mongoose";

import { aboutUS } from "../../interface/aboutUs";

const aboutUSSchema: Schema = new Schema<aboutUS>(
    {
        title: {
            type: String,
            required: true,
        },
        image: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "image",
        },
        description: {
            type: String,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const aboutUS = mongoose.model<aboutUS>("aboutUS", aboutUSSchema);

export default aboutUS;
