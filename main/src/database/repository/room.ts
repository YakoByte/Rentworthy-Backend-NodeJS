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
            console.log("roomInputs", roomInputs);
            let room = await roomModel.findOne(
                {
                    isDeleted: false,
                    productId: roomInputs.productId,
                    userId: roomInputs.userId,
                    vendorId: roomInputs.vendorId,
                });
            console.log("room", room)
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
            let criteria: getRoomRequest = { isDeleted: false }
            if (roomInputs.productId) {
                criteria = { ...criteria, productId: roomInputs.productId }
            }
            if (roomInputs.userId) {
                criteria = { ...criteria, userId: roomInputs.userId }
            }
            if (roomInputs.vendorId) {
                criteria = { ...criteria, vendorId: roomInputs.vendorId }
            }
            if (roomInputs.roomId) {
                criteria = { ...criteria, _id: roomInputs.roomId }
            }
            let room = await roomModel.findOne(criteria);
            if (!room) {
                return FormateData({ message: "Room not found" });
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
