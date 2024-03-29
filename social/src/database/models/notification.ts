import mongoose, { Schema } from "mongoose";

import { Notification } from "../../interface/notification";

const notificationSchema: Schema = new Schema<Notification>(
        {
            title: { type: String, required: true },
            description: { type: String },
            isRead: { type: Boolean, default: false },
            receiverId: [{ type: Schema.Types.ObjectId, ref: "User" }],
            type: { type: String },
            isDeleted: { type: Boolean, default: false },
            isActive: { type: Boolean, default: true }
        },
    { timestamps: true }
);

const Notification = mongoose.model<Notification>("Notification", notificationSchema);

export default Notification;
