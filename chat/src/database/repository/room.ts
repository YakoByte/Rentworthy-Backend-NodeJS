import { roomModel, messageModel, historyModel } from "../models";
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
import { roomData, roomRequest, getRoomRequest, deleteRoomRequest } from "../../interface/room";
import { messageData, messageRequest, getMessageRequest, deleteMessageRequest } from "../../interface/messages";
class RoomRepository {
    //create room
    async CreateRoom(roomInputs: roomRequest) {

        try {
            let room = await roomModel.findOne(
                {
                    productId: roomInputs.productId,
                    userId: roomInputs.userId,
                    vendorId: roomInputs.vendorId,
                    isDeleted: false
                });
            if (room) {
                return FormateData(room);
            }
            let roomResult = await roomModel.create(roomInputs);
            return FormateData(roomResult);
        } catch (error) {
            return error;
        }
    }
    //get room
    async GetRoom(roomInputs: getRoomRequest) {

        try {
            let criteria: any = { isDeleted: false }
            let room: any
            if (roomInputs.productId) {
                criteria = { ...criteria, productId: roomInputs.productId }
                roomInputs.lastMessage = true;
                // room = await roomModel.findOne(criteria);
            }
            if (roomInputs._id) {
                criteria = { ...criteria, _id: roomInputs._id }
                roomInputs.lastMessage = true;
            }
            if (roomInputs.userId) {
                criteria = { ...criteria, $or: [{ userId: roomInputs.userId }, { vendorId: roomInputs.userId }], isActive: true, isDeleted: false }
                room = await roomModel.findOne(criteria);
            }
            if (roomInputs.vendorId) {
                criteria = { ...criteria, vendorId: roomInputs.vendorId }
                room = await roomModel.findOne(criteria);
            } if (roomInputs.rentingId) {
                criteria = { ...criteria, userId: roomInputs.rentingId }
                room = await roomModel.findOne(criteria);
            }
            if (roomInputs.unRead) {
                // show only unread messages rooms
                //if message is seen then dont show that room
                let tempRooms: any = await roomModel.find(criteria);
                room = [];
                for (let i = 0; i < tempRooms.length; i++) {
                    const element: any = tempRooms[i];
                    let message: any = await messageModel.findOne({ roomId: element._id, isSeen: false });
                    if (message) {
                        room.push({ ...element, lastMessage: message.message, lastMessageTime: message.createdAt });
                    }
                }
                // room = await roomModel.find(criteria);
            }
            if (roomInputs.lastMessage) {
                // show only unread messages rooms
                //if message is seen then dont show that room
                let tempRooms: any = await roomModel.find(criteria).lean();
                room = [];
                for (let i = 0; i < tempRooms.length; i++) {
                    const element: any = tempRooms[i];
                    let message: any = await messageModel.findOne({ roomId: element._id }).sort({ createdAt: -1 }).lean();
                    if (message) {
                        room.push({ ...element, lastMessage: message.message, lastMessageTime: message.createdAt });
                    } else {
                        room.push({ ...element, lastMessage: "", lastMessageTime: "" });
                    }
                }
                // room = await roomModel.find(criteria);
            }
            if (!room) {
                return { message: "Room not found" };
            }

            return room;
        } catch (error) {
            return error;
        }
    }
    // get rooms
    async GetRooms(roomInputs: roomRequest) {

        try {
            let criteria: roomRequest = { isDeleted: false }
            if (roomInputs.productId) {
                criteria = { ...criteria, productId: roomInputs.productId }
            }
            if (roomInputs.userId) {
                criteria = { ...criteria, userId: roomInputs.userId }
            }
            if (roomInputs.vendorId) {
                criteria = { ...criteria, vendorId: roomInputs.vendorId }
            }
            let rooms = await roomModel.find(criteria);
            if (!roomInputs) {
                return FormateData({ message: "Room not found" });
            }
            for (let i = 0; i < rooms.length; i++) {
                const element: any = rooms[i];
                let lastMessage: any = await messageModel.findOne({ roomId: element._id }).sort({ createdAt: -1 });
                if (lastMessage) {
                    element.lastMessage = lastMessage.message;
                    element.lastMessageTime = lastMessage.createdAt;
                }
            }
            return FormateData(rooms);
        } catch (error) {
            return error;
        }
    }
    //delete room
    async DeleteRoom(roomInputs: deleteRoomRequest) {

        try {
            let roomResult = await roomModel.updateOne({ _id: roomInputs._id }, { isDeleted: true });
            return FormateData(roomResult);
        } catch (error) {
            return error;
        }
    }

    // inActive room
    async InActiveRoom(roomInputs: deleteRoomRequest) {
        try {
            let roomResult = await roomModel.updateOne({ _id: roomInputs._id }, { isActive: false });
            return FormateData(roomResult);
        } catch (error) {
            return error;
        }
    }
}

export default RoomRepository;
