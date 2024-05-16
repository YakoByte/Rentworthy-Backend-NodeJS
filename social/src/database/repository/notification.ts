import { Notification } from "../models/index";
import {
  ICreateNotification,
  IGetNotifications,
  IUpdateNotification,
} from "../../interface/notification";

class NotificationRepository {
  // create Notification
  async createNotification(data: ICreateNotification): Promise<IGetNotifications> {
    try {
      const notification = await Notification.create(data);

      return notification.toObject() as IGetNotifications;
    } catch (error) {
      console.error("Error creating Notification:", error);
      throw new Error("Notification creation failed");
    }
  }

  // update Notification by id
  async updateNotification(data: IUpdateNotification): Promise<IGetNotifications> {
    try {
      if(data.receiverId) {
        await Notification.findByIdAndUpdate(data._id, { $push: { receiverId: data.receiverId } }, { new: true });
        delete  data["receiverId"];
      }
      const updateNotification = await Notification.findByIdAndUpdate(
        data._id,
        data,
        { new: true }
      );

      if (!updateNotification) {
        throw new Error(`Notification with id ${data._id} not found`);
      }

      return updateNotification.toObject() as IGetNotifications;
    } catch (error) {
      console.error("Error updating Notification:", error);
      throw new Error("Notification updation failed");
    }
  }

  // delete Notification by id
  async deleteNotification(id: string): Promise<Boolean> {
    try {
      const notification = await Notification.findByIdAndUpdate(id, { isDeleted: true, isActive: false }, { new: true });

      if (!notification) {
        throw new Error(`Notification with id ${id} not found`);
      }

      return true;
    } catch (error) {
      console.error("Error deleting Notification:", error);
      throw new Error("Notification deletion failed");
    }
  }

  // get all Notifications
  async getNotification(pageNo: number, limit: number): Promise<IGetNotifications[]> {
    try {
      let notifications = [];

      if (pageNo === -1 || limit === -1) {
        // Retrieve all Notifications if pageNo or limit is -1
        notifications = await Notification.find({ isDeleted: false, isActive: true });
      } else {
        // Retrieve paginated Notifications
        notifications = await Notification.find({ isDeleted: false, isActive: true })
          .skip((pageNo - 1) * limit)
          .limit(limit);
      }

      if (!notifications) {
        throw new Error("Notifications not found");
      }

      return notifications.map((notification) =>
      notification.toObject()
      ) as IGetNotifications[];
    } catch (error) {
      console.error("Error getting Notifications:", error);
      throw new Error("Notifications not found");
    }
  }

  // get Notification by id
  async getNotificationById(id: string): Promise<IGetNotifications> {
    try {
      const notification = await Notification.findById(id);
      if (!notification) {
        throw new Error(`Notification with id ${id} not found`);
      }
      return notification.toObject() as IGetNotifications;
    } catch (error) {
      console.error("Error getting Notification:", error);
      throw new Error("Notification not found");
    }
  }

  // get Notification
  async getNotificationByReceiverId(receiverId: string): Promise<IGetNotifications[]> {
    try {
      const notifications = await Notification.find({ receiverId: { $in: [receiverId] }, isActive: true, isDeleted: false });
      if (!notifications) {
        throw new Error(`Notification with receiverId ${receiverId} not found`);
      }
      return notifications.map((notification) => notification.toObject()) as IGetNotifications[];
    } catch (error) {
      console.error("Error getting Notification:", error);
      throw new Error("Notification not found");
    }
  }
}

export default NotificationRepository;
