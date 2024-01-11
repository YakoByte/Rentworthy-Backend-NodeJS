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
        title: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            required: true,
        },
        isDeleted: {
            type: Boolean,
            required: true,
        },
    },
    { timestamps: true }
);

const Subscriptions = mongoose.model<Subscription>("Subscription", subscriptionSchema);

export default Subscriptions;
