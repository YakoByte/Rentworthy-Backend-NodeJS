"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const utils_1 = require("../../utils");
class RoomRepository {
    //create room
    async CreateRoom(roomInputs) {
        try {
            console.log("roomInputs", roomInputs);
            let room = await models_1.roomModel.findOne({
                isDeleted: false,
                productId: roomInputs.productId,
                userId: roomInputs.userId,
                vendorId: roomInputs.vendorId,
            });
            console.log("room", room);
            if (room) {
                return (0, utils_1.FormateData)(room);
            }
            let roomResult = await models_1.roomModel.create(roomInputs);
            return (0, utils_1.FormateData)(roomResult);
        }
        catch (error) {
            return error;
        }
    }
    //get room
    async GetRoom(roomInputs) {
        try {
            let criteria = { isDeleted: false };
            if (roomInputs.productId) {
                criteria = { ...criteria, productId: roomInputs.productId };
            }
            if (roomInputs.userId) {
                criteria = { ...criteria, userId: roomInputs.userId };
            }
            if (roomInputs.vendorId) {
                criteria = { ...criteria, vendorId: roomInputs.vendorId };
            }
            if (roomInputs.roomId) {
                criteria = { ...criteria, _id: roomInputs.roomId };
            }
            let room = await models_1.roomModel.findOne(criteria);
            if (!room) {
                return (0, utils_1.FormateData)({ message: "Room not found" });
            }
            return room;
        }
        catch (error) {
            return error;
        }
    }
    // get rooms
    async GetRooms(roomInputs) {
        try {
            let criteria = { isDeleted: false };
            if (roomInputs.productId) {
                criteria = { ...criteria, productId: roomInputs.productId };
            }
            if (roomInputs.userId) {
                criteria = { ...criteria, userId: roomInputs.userId };
            }
            if (roomInputs.vendorId) {
                criteria = { ...criteria, vendorId: roomInputs.vendorId };
            }
            let rooms = await models_1.roomModel.find(criteria);
            if (!roomInputs) {
                return (0, utils_1.FormateData)({ message: "Room not found" });
            }
            for (let i = 0; i < rooms.length; i++) {
                const element = rooms[i];
                let lastMessage = await models_1.messageModel.findOne({ roomId: element._id }).sort({ createdAt: -1 });
                if (lastMessage) {
                    element.lastMessage = lastMessage.message;
                    element.lastMessageTime = lastMessage.createdAt;
                }
            }
            return (0, utils_1.FormateData)(rooms);
        }
        catch (error) {
            return error;
        }
    }
    //delete room
    async DeleteRoom(roomInputs) {
        try {
            let roomResult = await models_1.roomModel.updateOne({ _id: roomInputs._id }, { isDeleted: true });
            return (0, utils_1.FormateData)(roomResult);
        }
        catch (error) {
            return error;
        }
    }
    // inActive room
    async InActiveRoom(roomInputs) {
        try {
            let roomResult = await models_1.roomModel.updateOne({ _id: roomInputs._id }, { isActive: false });
            return (0, utils_1.FormateData)(roomResult);
        }
        catch (error) {
            return error;
        }
    }
}
exports.default = RoomRepository;
