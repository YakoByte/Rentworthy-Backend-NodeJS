import mongoose, { Schema } from "mongoose";

import { Notification } from "../../interface/notification";

const notificationSchema: Schema = new Schema<Notification>(
    {
        title: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
        },
        type: {
            type: String,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Notification = mongoose.model<Notification>("Notification", notificationSchema);

export default Notification;
