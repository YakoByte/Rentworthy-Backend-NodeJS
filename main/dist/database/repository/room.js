"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
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
            if (room) {
                return room;
            }
            let roomResult = await models_1.roomModel.create(roomInputs);
            return roomResult;
        }
        catch (error) {
            console.log("error", error);
            throw new Error("Unable to Create Room");
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
                return { message: "Room not found" };
            }
            return room;
        }
        catch (error) {
            console.log("error", error);
            throw new Error("Unable to Get Room");
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
                return { message: "Room not found" };
            }
            for (let i = 0; i < rooms.length; i++) {
                const element = rooms[i];
                let lastMessage = await models_1.messageModel
                    .findOne({ roomId: element._id })
                    .sort({ createdAt: -1 });
                if (lastMessage) {
                    element.lastMessage = lastMessage.message;
                    element.lastMessageTime = lastMessage.createdAt;
                }
            }
            return rooms;
        }
        catch (error) {
            console.log("error", error);
            throw new Error("Unable to Get Room");
        }
    }
    //delete room
    async DeleteRoom(roomInputs) {
        try {
            let roomResult = await models_1.roomModel.updateOne({ _id: roomInputs._id }, { isDeleted: true });
            return roomResult;
        }
        catch (error) {
            console.log("error", error);
            throw new Error("Unable to Delete Room");
        }
    }
    // inActive room
    async InActiveRoom(roomInputs) {
        try {
            let roomResult = await models_1.roomModel.updateOne({ _id: roomInputs._id }, { isActive: false });
            return roomResult;
        }
        catch (error) {
            console.log("error", error);
            throw new Error("Unable to InActive Room");
        }
    }
}
exports.default = RoomRepository;
