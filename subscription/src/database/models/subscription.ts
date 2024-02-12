import mongoose, { Schema, Document, Types } from "mongoose";

import { Subscription } from "../../interface/subscription";

const subscriptionSchema: Schema = new Schema<Subscription>(
    {
        points: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        timelimit: {
            type: String,
        },
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
        isActive: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Subscriptions = mongoose.model<Subscription>("Subscription", subscriptionSchema);

export default Subscriptions;
