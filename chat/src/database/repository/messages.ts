import { BookingModel, ProductModel, messageModel, roomModel } from "../models";
import {
  messageRequest,
  getMessageRequest,
  deleteMessageRequest,
  Message,
} from "../../interface/messages";
import { Types } from "mongoose";

class MessageRepository {
  //create message
  async CreateMessage(messageInputs: messageRequest) {
    try {
      let messageData = {
        receiverId: messageInputs.receiverId,
        senderId: messageInputs.senderId,
        roomId: messageInputs.roomId,
        message: messageInputs.message,
        messageType: messageInputs.messageType,
        isSeen: false,
        isDeleted: false,
        isActive: true,
      };

      let room = await roomModel.findOne({
        $or: [
          {_id: messageInputs.roomId}, 
          { senderId: messageInputs.senderId, receiverId: messageInputs.receiverId },
          { bookingId: messageInputs.bookingId, senderId: messageInputs.senderId, receiverId: messageInputs.receiverId },
          { productId: messageInputs.productId, senderId: messageInputs.senderId, receiverId: messageInputs.receiverId }
        ],
        isDeleted: false, isActive: true
      });

      if (room) {
        if(room?.receiverId) {
          messageData.receiverId = room?.receiverId.toString();
        } else if(room?.productId) {
          const product = await ProductModel.findById(room.productId);
          messageData.receiverId = product?.userId.toString();
        } else if(room?.bookingId) {
          const booking = await BookingModel.findById(room?.bookingId);
          const product = await ProductModel.findById(booking?.productId);
          messageData.receiverId = product?.userId.toString();
        }

        messageData.roomId = room._id.toString();

        let messageResult = await messageModel.create(messageData);
        return messageResult;
      } else {
        throw new Error("Room not found");
      }
    } catch (error) {
      console.log("Error:", error);
      throw new Error("Unable to Create Message");
    }
  }

  //get message
  async GetMessage(messageInputs: getMessageRequest) {
    try {      
      let criteria: any = { isDeleted: false, isActive: true };
      if (messageInputs.senderId) {
        criteria = { ...criteria, senderId: messageInputs.senderId };
      }
      if (messageInputs.receiverId) {
        criteria = { ...criteria, receiverId: messageInputs.receiverId };
      }
      if (messageInputs.roomId) {
        criteria = { ...criteria, roomId: messageInputs.roomId };
      }

      let messages = await messageModel.find(criteria);
      if (!messages || messages.length === 0) {
          messages = await messageModel.find({
              isDeleted: false,
              $or: [{ receiverId: messageInputs.senderId }, { senderId: messageInputs.senderId }]
          });
      }

      Promise.all(messages.map((element) => {
        if (element?.receiverId.toString() === messageInputs?.senderId?.toString() && messageInputs?.roomId?.toString() === element?.roomId?.toString()) {          
            return messageModel.updateMany(
                { roomId: messageInputs.roomId },
                { $set: { isSeen: true } },
                { new: true }
            );
        }
      }));
      
      
      return messages;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Get Message");
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
