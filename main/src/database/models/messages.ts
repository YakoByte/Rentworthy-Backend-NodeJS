import mongoose, { Schema, Document, Types } from "mongoose";

import { Message } from "../interface/messages";

const messageSchema: Schema = new Schema<Message>(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        message: {
            type: String,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        messageType: {
            type: String,
        },
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
        },
        isSeen: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Messages = mongoose.model<Message>("Message", messageSchema);

export default Messages;
