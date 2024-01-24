import { NotificationModel } from "../models";
import {
  notificationRequest,
  notificationUpdateRequest,
} from "../../interface/notification";

class NotificationRepository {
  //create Notification
  async CreateNotification(NotificationInputs: notificationRequest) {
    try {
      const NotificationResult = await NotificationModel.create(
        NotificationInputs
      );
      if (NotificationResult) {
        return NotificationResult;
      }
      return { message: "Failed to create Notification" };
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Create Notification");
    }
  }

  //get one Notification
  async getNotification(NotificationInputs: notificationRequest) {
    try {
      const NotificationResult = await NotificationModel.find(
        NotificationInputs
      );
      if (!NotificationResult) {
        return { message: "No Notification" };
      }
      return NotificationResult;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Get Notification");
    }
  }

  //update Notification by id
  async updateNotificationById(NotificationInputs: notificationUpdateRequest) {
    try {
      const NotificationResult = await NotificationModel.findOneAndUpdate(
        { _id: NotificationInputs._id, isDeleted: false },
        { $set: NotificationInputs },
        { new: true }
      );

      if (NotificationResult) {
        return NotificationResult;
      }

      return { message: "Notification Update failed" };
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Update Notification");
    }
  }

  //delete Notification by id
  async deleteNotificationById(NotificationInputs: { _id: string }) {
    try {
      const NotificationResult = await NotificationModel.findOneAndUpdate(
        { _id: NotificationInputs._id, isDeleted: false },
        { isDeleted: true },
        { new: true }
      );
      if (NotificationResult) {
        return { message: "Notification Deleted" };
      }

      return { message: "Notification Delete Failed" };
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Delete Notification");
    }
  }
}

export default NotificationRepository;
