"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
class MessageRepository {
    //create message
    async CreateMessage(messageInputs) {
        try {
            let room = await models_1.roomModel.findOne({
                $or: [
                    {
                        userId: messageInputs.senderId,
                        vendorId: messageInputs.receiverId,
                    },
                    {
                        userId: messageInputs.receiverId,
                        vendorId: messageInputs.senderId,
                    },
                ],
                _id: messageInputs.roomId,
                isDeleted: false,
            });
            if (room) {
                let messageResult = await models_1.messageModel.create(messageInputs);
                return messageResult;
            }
            else {
                throw new Error("Room not found");
            }
        }
        catch (error) {
            console.log("Error:", error);
            throw new Error("Unable to Create Message");
        }
    }
    // group message in multiple room
    async GroupMessage(messageInputs) {
        try {
            let room = await models_1.roomModel.findOne({
                _id: messageInputs.roomId,
                isDeleted: false,
            });
            console.log("room", room);
            if (room) {
                let messageResult = await models_1.messageModel.create(messageInputs);
                return messageResult;
            }
            return { message: "Room not found" };
        }
        catch (error) {
            console.log("error", error);
            throw new Error("Unable to Create group Message");
        }
    }
    //get message
    async GetMessage(messageInputs) {
        try {
            let criteria = { isDeleted: false };
            if (messageInputs.senderId) {
                criteria = { ...criteria, senderId: messageInputs.senderId };
            }
            else if (messageInputs.receiverId) {
                criteria = { ...criteria, receiverId: messageInputs.receiverId };
            }
            else if (messageInputs.roomId) {
                criteria = { ...criteria, roomId: messageInputs.roomId };
            }
            else {
                criteria = {
                    ...criteria,
                    $or: [{ receiverId: messageInputs.userId }, { senderId: messageInputs.userId }],
                };
            }
            let message = await models_1.messageModel.find(criteria);
            if (!message) {
                return { message: "Message not found" };
            }
            return message;
        }
        catch (error) {
            console.log("error", error);
            throw new Error("Unable to Get Message");
        }
    }
    // get messages
    async GetMessages(messageInputs) {
        try {
            let criteria = { isDeleted: false };
            if (messageInputs.senderId) {
                criteria = { ...criteria, senderId: messageInputs.senderId };
            }
            if (messageInputs.receiverId) {
                criteria = { ...criteria, senderId: messageInputs.receiverId };
            }
            if (messageInputs.roomId) {
                criteria = { ...criteria, roomId: messageInputs.roomId };
            }
            let message = await models_1.messageModel.find(criteria);
            if (!message) {
                return { message: "Message not found" };
            }
            return message;
        }
        catch (error) {
            console.log("error", error);
            throw new Error("Unable to Get Message");
        }
    }
    // delete message
    async DeleteMessage(messageInputs) {
        try {
            let message = await models_1.messageModel.findOne({
                _id: messageInputs._id,
                isDeleted: false,
            });
            if (!message) {
                return {
                    message: "Message not found",
                };
            }
            let messageResult = await models_1.messageModel.updateOne({
                _id: messageInputs._id,
                isDeleted: false,
            }, {
                $set: {
                    isDeleted: true,
                },
            });
            return { message: "Message deleted successfully" };
        }
        catch (error) {
            console.log("error", error);
            throw new Error("Unable to delete Message");
        }
    }
}
exports.default = MessageRepository;
