import mongoose, { Schema } from "mongoose";

import { banner } from "../../interface/banner";

const bannerSchema: Schema = new Schema<banner>(
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

const banner = mongoose.model<banner>("banner", bannerSchema);

export default banner;
