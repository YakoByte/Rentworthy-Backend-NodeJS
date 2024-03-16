import { messageModel, roomModel } from "../models";
import {
  messageRequest,
  getMessageRequest,
  deleteMessageRequest,
} from "../../interface/messages";

class MessageRepository {
  //create message
  async CreateMessage(messageInputs: messageRequest) {
    try {
      let room = await roomModel.findOne({
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
        let messageResult = await messageModel.create(messageInputs);
        return messageResult;
      } else {
        throw new Error("Room not found");
      }
    } catch (error) {
      console.log("Error:", error);
      throw new Error("Unable to Create Message");
    }
  }

  // group message in multiple room
  async GroupMessage(messageInputs: messageRequest) {
    try {
      let room = await roomModel.findOne({
        _id: messageInputs.roomId,
        isDeleted: false,
      });
      console.log("room", room);
      if (room) {
        let messageResult = await messageModel.create(messageInputs);
        return messageResult;
      }
      return { message: "Room not found" };
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Create group Message");
    }
  }

  //get message
  async GetMessage(messageInputs: getMessageRequest) {
    try {
      let criteria: getMessageRequest = { isDeleted: false };
      if (messageInputs.senderId) {
        criteria = { ...criteria, senderId: messageInputs.senderId };
      }
      if (messageInputs.receiverId) {
        criteria = { ...criteria, receiverId: messageInputs.receiverId };
      }
      if (messageInputs.roomId) {
        criteria = { ...criteria, roomId: messageInputs.roomId };
      }
      let message = await messageModel.find(criteria);
      if (!message) {
        return { message: "Message not found" };
      }
      return message;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Get Message");
    }
  }

  // get messages
  async GetMessages(messageInputs: messageRequest) {
    try {
      let criteria: messageRequest = { isDeleted: false };
      if (messageInputs.senderId) {
        criteria = { ...criteria, senderId: messageInputs.senderId };
      }
      if (messageInputs.receiverId) {
        criteria = { ...criteria, senderId: messageInputs.receiverId };
      }
      if (messageInputs.roomId) {
        criteria = { ...criteria, roomId: messageInputs.roomId };
      }
      let message = await messageModel.find(criteria);
      if (!message) {
        return { message: "Message not found" };
      }
      return message;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Get Message");
    }
  }

  // delete message
  async DeleteMessage(messageInputs: deleteMessageRequest) {
    try {
      let message = await messageModel.findOne({
        _id: messageInputs._id,
        isDeleted: false,
      });
      if (!message) {
        return {
          message: "Message not found",
        };
      }
      let messageResult = await messageModel.updateOne(
        {
          _id: messageInputs._id,
          isDeleted: false,
        },
        {
          $set: {
            isDeleted: true,
          },
        }
      );
      return { message: "Message deleted successfully" };
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to delete Message");
    }
  }
}

export default MessageRepository;
