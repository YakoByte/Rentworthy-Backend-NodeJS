import mongoose, { Schema, Document, Types } from "mongoose";

import { Subscription } from "../../interface/subscription";

const subscriptionSchema: Schema = new Schema<Subscription>(
    {
        points: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        currency: {
            type: String,
            required: true,
            default: "USD",
        },
        description: {
            type: String,
            required: true,
        },
        timelimit: {
            type: String,
            enum: ['day', 'week', 'month', 'year']
        },
        title: {
            type: String,
            required: true,
        },
        planId: {
            type: String,
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
