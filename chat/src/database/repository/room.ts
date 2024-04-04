import { roomModel, messageModel, ProfileModel, ProductModel, BookingModel } from "../models";
import {
  roomRequest,
  getRoomRequest,
  deleteRoomRequest,
} from "../../interface/room";
import { Types } from "mongoose";
import { generatePresignedUrl } from "../../utils/aws";

class RoomRepository {
  //create room
  async CreateRoom(roomInputs: roomRequest) {
    try {
      let room = await roomModel.findOne({
        $or: [
          { senderId: roomInputs.senderId, receiverId: roomInputs.receiverId },
          { bookingId: roomInputs.bookingId, senderId: roomInputs.senderId, receiverId: roomInputs.receiverId },
          { productId: roomInputs.productId, senderId: roomInputs.senderId, receiverId: roomInputs.receiverId }
        ],
        isDeleted: false, isActive: true
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
      let criteria: any = { isDeleted: false, isActive: true };
      if (roomInputs.receiverId) {
        criteria = { ...criteria, receiverId: roomInputs.receiverId };
      }
      else if (roomInputs.productId) {
        criteria = { ...criteria, productId: roomInputs.productId };
        roomInputs.lastMessage = true;
      }
      else if (roomInputs.bookingId) {
        criteria = { ...criteria, bookingId: roomInputs.bookingId };
      }
      else if (roomInputs._id) {
        criteria = { ...criteria, _id: roomInputs._id };
        roomInputs.lastMessage = true;
      }
      else if (roomInputs.senderId) {
        criteria = {
          ...criteria,
          $or: [{ senderId: roomInputs.senderId }, { receiverId: roomInputs.senderId }],
        };
      } else {
        criteria = {...criteria}
      }

      let room = await roomModel.find(criteria);

      if (!room) {
        return { message: "Room not found" };
      }   
      
      let AllRoom = [];

      for (let i = 0; i < room.length; i++) {
        const element: any = room[i];

        let message: any = await messageModel
            .find({ roomId: element._id })
            .sort({ createdAt: -1 })
            .limit(1);
        let unSeenMessageCount: any = await messageModel.countDocuments({
          roomId: element._id,
          isSeen: false,
        });
        let unSeenMessages: any = await messageModel.find({
          roomId: element._id,
          isSeen: false,
        });
      
        let promiseArray: Promise<any>[] = [];
        unSeenMessages.forEach((element: any) => {
            promiseArray.push(new Promise((resolve, reject) => {
                resolve({
                    message: element.message,
                    messageTime: element.createdAt,
                });
            }));
        });
  
        unSeenMessages = await Promise.all(promiseArray);

        let receiverProfile = await ProfileModel.aggregate([
          {
            $match: { senderId: new Types.ObjectId(element.receiverId), isDeleted: false, isActive: true },
          },
          {
            $lookup: {
                from: "images",
                localField: "profileImage",
                foreignField: "_id",
                pipeline: [
                    { $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, senderId: 1 } },
                ],
                as: "profileImage",
            },
          }, 
          {
            $unwind: {
              path: "$profileImage",
              preserveNullAndEmptyArrays: true
            }
          },
        ]);
        if (receiverProfile.length > 0 && receiverProfile[0]?.profileImage?.imageName) {
          receiverProfile[0].profile = await generatePresignedUrl(receiverProfile[0].profileImage.imageName);
        }
        
        let senderProfile = await ProfileModel.aggregate([
          {
            $match: { senderId: new Types.ObjectId(element.senderId), isDeleted: false, isActive: true },
          },
          {
            $lookup: {
                from: "images",
                localField: "profileImage",
                foreignField: "_id",
                pipeline: [
                    { $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, senderId: 1 } },
                ],
                as: "profileImage",
            },
          }, 
          {
            $unwind: {
              path: "$profileImage",
              preserveNullAndEmptyArrays: true
            }
          },
        ]);
        if (senderProfile.length > 0 && senderProfile[0]?.profileImage?.imageName) {
          senderProfile[0].profile = await generatePresignedUrl(senderProfile[0].profileImage.imageName);
        }

        let productProfile = await ProductModel.aggregate([
          {
            $match: { _id: new Types.ObjectId(element.productId) },
          },
          {
            $lookup: {
              from: "images",
              localField: "images",
              foreignField: "_id",
              pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, senderId: 1 } }],
              as: "images",
            },
          },
          {
            $unwind: {
              path: "$profileImage",
              preserveNullAndEmptyArrays: true
            }
          },
        ]);
        productProfile[0]?.images?.forEach(async(element: any) => {
          let newPath = await generatePresignedUrl(element.imageName);
          element.path = newPath;
        });

        let booking = await BookingModel.findById(element.bookingId);
        let bookingData:any;
        if(booking) {
          let BookingProfile = await ProductModel.aggregate([
            {
              $match: { _id: new Types.ObjectId(booking.productId) },
            },
            {
              $lookup: {
                from: "images",
                localField: "images",
                foreignField: "_id",
                pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, senderId: 1 } }],
                as: "images",
              },
            },
            {
              $unwind: {
                path: "$profileImage",
                preserveNullAndEmptyArrays: true
              }
            },
          ]);
          
          Promise.all(BookingProfile.map(element => {
            if (element.images) {
                return Promise.all(element.images.map((imgelement: any) => {
                    return generatePresignedUrl(imgelement.imageName).then(newPath => {
                        element.path = newPath;
                    });
                }));
            }
          })).then(() => {
              const bookingData = {
                  BookingProfile: BookingProfile[0]?.images[0]?.path || "",
                  BookingName: BookingProfile[0]?.name || "",
              };
              console.log("Booking data:", bookingData);
          }).catch(error => {
              console.error("An error occurred:", error);
          });
        }
        
        AllRoom.push({
            _id: element?._id || "",
            senderId: element?.senderId || "",
            receiverId: element?.receiverId || "",
            isDeleted: element?.isDeleted ? true : false,
            isActive: element?.isActive ? true : false,
            lastMessage: message[0]?.message || "",
            lastMessageTime: message[0]?.createdAt || "",
            unSeenMessageCount: unSeenMessageCount,
            unSeenMessages: unSeenMessages,
            productProfile: productProfile[0]?.images[0]?.path || "",
            productName: productProfile[0]?.name || "",
            BookingProfile: bookingData?.BookingProfile || "",
            BookingName: bookingData?.BookingName || "",
            receiverProfile: receiverProfile[0]?.profile || "",
            receiverName: receiverProfile[0]?.userName || "",
            senderProfile: senderProfile[0]?.profile || "",
            senderName: senderProfile[0]?.userName || "",
        });
      }

      return AllRoom;
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
      if (roomInputs.senderId) {
        criteria = { ...criteria, senderId: roomInputs.senderId };
      }
      if (roomInputs.receiverId) {
        criteria = { ...criteria, receiverId: roomInputs.receiverId };
      }
      let rooms = await roomModel.find(criteria);
      if (!roomInputs) {
        return { message: "Room not found" };
      }
      for (let i = 0; i < rooms.length; i++) {
        const element: any = rooms[i];
        let lastMessage: any = await messageModel
          .find({ roomId: element._id })
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
