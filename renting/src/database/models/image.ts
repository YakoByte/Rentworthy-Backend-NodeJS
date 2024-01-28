import mongoose, { Schema, Document, Types } from "mongoose";

import { Image } from "../../interface/imageUpload";

const imageSchema: Schema = new Schema<Image>(
    {
        imageName: {
            type: String,
        },
        mimetype: {
            type: String,
        },
        path: {
            type: String,
        },
        size: {
            type: Number,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },

    },
    { timestamps: true }
);

const Images = mongoose.model<Image>("Image", imageSchema);

export default Images;
