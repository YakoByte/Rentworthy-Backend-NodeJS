"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const messages_1 = __importDefault(require("../database/repository/messages"));
const utils_1 = require("../utils");
const app_error_1 = require("../utils/app-error");
// All Business logic will be here
class messageService {
    repository;
    constructor() {
        this.repository = new messages_1.default();
    }
    // create message
    async CreateMessage(messageInputs) {
        try {
            const existingMessage = await this.repository.CreateMessage(messageInputs);
            return existingMessage;
        }
        catch (err) {
            throw new app_error_1.Error("Data Not found", err);
        }
    }
    // group message in multiple room
    async GroupMessage(messageInputs) {
        try {
            if (messageInputs.roomId && messageInputs.roomId.length > 0) {
                for (let i = 0; i < messageInputs.roomId.length; i++) {
                    let roomDetail = {
                        roomId: messageInputs.roomId[i],
                        message: messageInputs.message,
                        senderId: messageInputs.senderId,
                        receiverId: messageInputs.receiverId,
                        messageType: messageInputs.messageType,
                    };
                    const existingMessage = await this.repository.GroupMessage(roomDetail);
                }
            }
            return (0, utils_1.FormateData)({ message: "Message sent" });
        }
        catch (err) {
            throw new app_error_1.Error("Data Not found", err);
        }
    }
    // get message
    async GetMessage(messageInputs) {
        try {
            const existingMessage = await this.repository.GetMessage(messageInputs);
            return (0, utils_1.FormateData)({ existingMessage });
        }
        catch (err) {
            throw new app_error_1.Error("Data Not found", err);
        }
    }
    // get messages
    async GetMessages(messageInputs) {
        try {
            const existingMessage = await this.repository.GetMessages(messageInputs);
            return existingMessage;
        }
        catch (err) {
            throw new app_error_1.Error("Data Not found", err);
        }
    }
    // delete message
    async DeleteMessage(messageInputs) {
        try {
            const existingMessage = await this.repository.DeleteMessage(messageInputs);
            return (0, utils_1.FormateData)({ existingMessage });
        }
        catch (err) {
            throw new app_error_1.Error("Data Not found", err);
        }
    }
}
module.exports = messageService;
