import mongoose, { Schema, Document, Types } from "mongoose";

import { SubscribedUser } from "../../interface/subscribedUser";

const imageSchema: Schema = new Schema<SubscribedUser>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        subscriptionPlan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subscription",
            required: true,
        },
        paymentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payment",
            required: true,
        },
        DateofSubscription: {
            type: String,
        },
        timelimit: {
            type: String,
        },
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

const SubscribedUsers = mongoose.model<SubscribedUser>("SubscribedUser", imageSchema);

export default SubscribedUsers;
