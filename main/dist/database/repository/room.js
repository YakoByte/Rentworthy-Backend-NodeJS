"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
class RoomRepository {
    //create room
    async CreateRoom(roomInputs) {
        try {
            let room = await models_1.roomModel.findOne({
                productId: roomInputs.productId,
                userId: roomInputs.userId,
                vendorId: roomInputs.vendorId,
                isDeleted: false,
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
            let room;
            if (roomInputs.productId) {
                criteria = { ...criteria, productId: roomInputs.productId };
                roomInputs.lastMessage = true;
            }
            if (roomInputs._id) {
                criteria = { ...criteria, _id: roomInputs._id };
                roomInputs.lastMessage = true;
            }
            if (roomInputs.userId) {
                criteria = {
                    ...criteria,
                    $or: [{ userId: roomInputs.userId }, { vendorId: roomInputs.userId }],
                    isActive: true,
                    isDeleted: false,
                };
                room = await models_1.roomModel.find(criteria);
            }
            if (roomInputs.vendorId) {
                criteria = { ...criteria, vendorId: roomInputs.vendorId };
                room = await models_1.roomModel.find(criteria);
            }
            if (roomInputs.rentingId) {
                criteria = { ...criteria, userId: roomInputs.rentingId };
                room = await models_1.roomModel.find(criteria);
            }
            if (roomInputs.unRead) {
                // show only unread messages rooms
                //if message is seen then dont show that room
                let tempRooms = await models_1.roomModel.find(criteria);
                room = [];
                for (let i = 0; i < tempRooms.length; i++) {
                    const element = tempRooms[i];
                    let message = await models_1.messageModel.find({
                        roomId: element._id,
                        isSeen: false,
                    });
                    if (message) {
                        room.push({
                            ...element,
                            lastMessage: message.message,
                            lastMessageTime: message.createdAt,
                        });
                    }
                }
                // room = await roomModel.find(criteria);
            }
            if (roomInputs.lastMessage) {
                // show only unread messages rooms
                //if message is seen then dont show that room
                let tempRooms = await models_1.roomModel.find(criteria).lean();
                room = [];
                for (let i = 0; i < tempRooms.length; i++) {
                    const element = tempRooms[i];
                    let message = await models_1.messageModel
                        .find({ roomId: element._id })
                        .sort({ createdAt: -1 })
                        .lean();
                    if (message) {
                        room.push({
                            ...element,
                            lastMessage: message.message,
                            lastMessageTime: message.createdAt,
                        });
                    }
                    else {
                        room.push({ ...element, lastMessage: "", lastMessageTime: "" });
                    }
                }
                // room = await roomModel.find(criteria);
            }
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
                    .find({ roomId: element._id })
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
