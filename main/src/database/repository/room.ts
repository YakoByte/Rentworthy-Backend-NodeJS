import { roomModel, messageModel } from "../models";
import {
  roomData,
  roomRequest,
  getRoomRequest,
  deleteRoomRequest,
} from "../../interface/room";
import {
  messageData,
  messageRequest,
  getMessageRequest,
  deleteMessageRequest,
} from "../../interface/messages";

class RoomRepository {
  //create room
  async CreateRoom(roomInputs: roomRequest) {
    try {
      console.log("roomInputs", roomInputs);
      let room = await roomModel.findOne({
        isDeleted: false,
        productId: roomInputs.productId,
        userId: roomInputs.userId,
        vendorId: roomInputs.vendorId,
      });

      if (room) {
        return room;
      }
      let roomResult = await roomModel.create(roomInputs);
      return roomResult;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Create Room");
    }
  }

  //get room
  async GetRoom(roomInputs: getRoomRequest) {
    try {
      let criteria: getRoomRequest = { isDeleted: false };
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
      let room = await roomModel.findOne(criteria);
      if (!room) {
        return { message: "Room not found" };
      }

      return room;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Get Room");
    }
  }
  // get rooms
  async GetRooms(roomInputs: roomRequest) {
    try {
      let criteria: roomRequest = { isDeleted: false };
      if (roomInputs.productId) {
        criteria = { ...criteria, productId: roomInputs.productId };
      }
      if (roomInputs.userId) {
        criteria = { ...criteria, userId: roomInputs.userId };
      }
      if (roomInputs.vendorId) {
        criteria = { ...criteria, vendorId: roomInputs.vendorId };
      }
      let rooms = await roomModel.find(criteria);
      if (!roomInputs) {
        return { message: "Room not found" };
      }

      for (let i = 0; i < rooms.length; i++) {
        const element: any = rooms[i];
        let lastMessage: any = await messageModel
          .findOne({ roomId: element._id })
          .sort({ createdAt: -1 });
        if (lastMessage) {
          element.lastMessage = lastMessage.message;
          element.lastMessageTime = lastMessage.createdAt;
        }
      }
      return rooms;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Get Room");
    }
  }
  //delete room
  async DeleteRoom(roomInputs: deleteRoomRequest) {
    try {
      let roomResult = await roomModel.updateOne(
        { _id: roomInputs._id },
        { isDeleted: true }
      );
      return roomResult;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Delete Room");
    }
  }

  // inActive room
  async InActiveRoom(roomInputs: deleteRoomRequest) {
    try {
      let roomResult = await roomModel.updateOne(
        { _id: roomInputs._id },
        { isActive: false }
      );
      return roomResult;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to InActive Room");
    }
  }
}

export default RoomRepository;
