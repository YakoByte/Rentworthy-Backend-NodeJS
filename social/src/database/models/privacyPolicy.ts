import mongoose, { Schema } from "mongoose";

import { privacyPolicy } from "../../interface/privacyPolicy";

const privacyPolicySchema: Schema = new Schema<privacyPolicy>(
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
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const PrivacyPolicy = mongoose.model<privacyPolicy>("PrivacyPolicy", privacyPolicySchema);

export default PrivacyPolicy;
