import { messageModel, historyModel, roomModel } from "../models";
import {
    FormateData,
    // GeneratePassword,
    // GenerateSalt,
    // GenerateSignature,
    // ValidatePassword,
} from '../../utils';
import {
    APIError,
    BadRequestError,
    STATUS_CODES,
} from "../../utils/app-error";
import { messageRequest, getMessageRequest, deleteMessageRequest } from "../../interface/messages";
class MessageRepository {
    //create message
    async CreateMessage(messageInputs: messageRequest) {
        try {
            let room = await roomModel.findOne(
                {
                    $or: [
                        { userId: messageInputs.senderId, vendorId: messageInputs.receiverId },
                        { userId: messageInputs.receiverId, vendorId: messageInputs.senderId }
                    ],
                    roomId: messageInputs.roomId,
                    isDeleted: false
                });
            if (room) {
                let messageResult = await messageModel.create(messageInputs);
                return FormateData(messageResult);
            }
            return FormateData({ message: "Room not found" });
        } catch (error) {
            return error;
        }
    }
    //get message
    async GetMessage(messageInputs: getMessageRequest) {

        try {
            let criteria: getMessageRequest = { isDeleted: false }
            if (messageInputs.senderId) {
                criteria = { ...criteria, senderId: messageInputs.senderId }
            }
            if (messageInputs.receiverId) {
                criteria = { ...criteria, receiverId: messageInputs.receiverId }
            }
            if (messageInputs.roomId) {
                criteria = { ...criteria, roomId: messageInputs.roomId }
            }
            let message = await messageModel.findOne(criteria);
            if (!message) {
                return FormateData({ message: "Message not found" });
            }
            return FormateData(message);
        } catch (error) {
            return error;
        }
    }
    // get messages
    async GetMessages(messageInputs: messageRequest) {

        try {
            let criteria: messageRequest = { isDeleted: false }
            if (messageInputs.userId) {
                criteria = { ...criteria, senderId: messageInputs.userId, receiverId: messageInputs.userId }

            }
            if (messageInputs.roomId) {
                criteria = { ...criteria, roomId: messageInputs.roomId }
            }
            let message = await messageModel.find(criteria);
            if (!message) {
                return FormateData({ message: "Message not found" });
            }
            return FormateData(message);
        } catch (error) {
            return error;
        }
    }
    // delete message
    async DeleteMessage(messageInputs: deleteMessageRequest) {

        try {
            let message = await messageModel.findOne(
                {
                    _id: messageInputs._id,
                    isDeleted: false
                });
            if (!message) {
                return FormateData({
                    message: "Message not found"
                });
            }
            let messageResult = await messageModel.updateOne(
                {
                    _id: messageInputs._id,
                    isDeleted: false
                },
                {
                    $set: {
                        isDeleted: true
                    }
                });
            return { message: "Message deleted successfully" };
        } catch (error) {
            return { error: error };
        }
    }
}

export default MessageRepository;
