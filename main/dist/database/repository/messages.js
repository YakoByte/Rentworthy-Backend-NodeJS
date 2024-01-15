"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const index_1 = require("../../utils/index");
class MessageRepository {
    //create message
    async CreateMessage(messageInputs) {
        try {
            let room = await models_1.roomModel.findOne({
                // $or: [
                //     // { userId: messageInputs.senderId, vendorId: messageInputs.receiverId },
                //     // { userId: messageInputs.receiverId, vendorId: messageInputs.senderId }
                // ],
                _id: messageInputs.roomId,
                isDeleted: false
            });
            console.log("room", room);
            if (room) {
                let messageResult = await models_1.messageModel.create(messageInputs);
                return messageResult;
            }
            return (0, index_1.FormateData)({ message: "Room not found" });
        }
        catch (error) {
            return error;
        }
    }
    // group message in multiple room
    async GroupMessage(messageInputs) {
        try {
            let room = await models_1.roomModel.findOne({
                // $or: [
                //     // { userId: messageInputs.senderId, vendorId: messageInputs.receiverId },
                //     // { userId: messageInputs.receiverId, vendorId: messageInputs.senderId }
                // ],
                _id: messageInputs.roomId,
                isDeleted: false
            });
            console.log("room", room);
            if (room) {
                let messageResult = await models_1.messageModel.create(messageInputs);
                return messageResult;
            }
            return (0, index_1.FormateData)({ message: "Room not found" });
        }
        catch (error) {
            return error;
        }
    }
    //get message
    async GetMessage(messageInputs) {
        try {
            let criteria = { isDeleted: false };
            if (messageInputs.senderId) {
                criteria = { ...criteria, senderId: messageInputs.senderId };
            }
            if (messageInputs.receiverId) {
                criteria = { ...criteria, receiverId: messageInputs.receiverId };
            }
            if (messageInputs.roomId) {
                criteria = { ...criteria, roomId: messageInputs.roomId };
            }
            let message = await models_1.messageModel.findOne(criteria);
            if (!message) {
                return (0, index_1.FormateData)({ message: "Message not found" });
            }
            return (0, index_1.FormateData)(message);
        }
        catch (error) {
            return error;
        }
    }
    // get messages
    async GetMessages(messageInputs) {
        try {
            let criteria = { isDeleted: false };
            if (messageInputs.userId) {
                criteria = { ...criteria, senderId: messageInputs.userId, receiverId: messageInputs.userId };
            }
            if (messageInputs.roomId) {
                criteria = { ...criteria, roomId: messageInputs.roomId };
            }
            let message = await models_1.messageModel.find(criteria);
            if (!message) {
                return (0, index_1.FormateData)({ message: "Message not found" });
            }
            return (0, index_1.FormateData)(message);
        }
        catch (error) {
            return error;
        }
    }
    // delete message
    async DeleteMessage(messageInputs) {
        try {
            let message = await models_1.messageModel.findOne({
                _id: messageInputs._id,
                isDeleted: false
            });
            if (!message) {
                return (0, index_1.FormateData)({
                    message: "Message not found"
                });
            }
            let messageResult = await models_1.messageModel.updateOne({
                _id: messageInputs._id,
                isDeleted: false
            }, {
                $set: {
                    isDeleted: true
                }
            });
            return { message: "Message deleted successfully" };
        }
        catch (error) {
            return { error: error };
        }
    }
}
exports.default = MessageRepository;
