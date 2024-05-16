import { Request, Response } from "express";
import NotificationRepository from "../database/repository/notification";
import { ICreateNotification } from "../interface/notification";
import { FormateData, FormateError } from '../utils';

const notificationRepository = new NotificationRepository();

class NotificationService {
  // create Notification
  async createNotification(req: Request, res: Response) {
    try {
      const { receiverId, title, description, type } = req.body;

      // Create Notification
      const data: ICreateNotification = {
        receiverId,
        title,
        description,
        type,
        isRead: false,
        isDeleted: false,
        isActive: true,
      };

      const result = await notificationRepository.createNotification(data);
      if (!result) {
        return res.status(404).json({ error: "Notification not created" });
      }

      const response_data = FormateData(result);
      return res.status(200).json(response_data);
    } catch (error: any) {
      const response_data = FormateError(error);
      return res.status(500).json(response_data);
    }
  }

  // update Notification
  async updateNotification(req: Request, res: Response) {
    try {
      const { ...data } = req.body;

      // Update Notification
      const result = await notificationRepository.updateNotification(data);
      if (!result) {
        return res.status(404).json({ error: "Notification not updated" });
      }

      const response_data = FormateData(result);
      return res.status(200).json(response_data);
    } catch (error: any) {
      const response_data = FormateError(error);
      return res.status(500).json(response_data);
    }
  }

  // delete Notification
  async deleteNotification(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Delete Notification
      const Notification = await notificationRepository.deleteNotification(id);
      if (!Notification) {
        return res.status(404).json({ error: "Notification not deleted" });
      }

      const response_data = FormateData(Notification);
      return res.status(200).json(response_data);
    } catch (error: any) {
      const response_data = FormateError(error);
      return res.status(500).json(response_data);
    }
  }

  // get all Notificationes
  async getNotifications(req: Request, res: Response) {
    try {
      let { id, receiverId, pageNo, limit } = req.query;

      pageNo = pageNo !== undefined ? String(pageNo) : "-1";
      limit = limit !== undefined ? String(limit) : "-1";

      const pageNoNumber = pageNo !== "-1" ? parseInt(pageNo, 10) : -1;
      const limitNumber = limit !== "-1" ? parseInt(limit, 10) : -1;

      let Notification;

      if(id){
        Notification = await notificationRepository.getNotificationById(String(id));
      }

      else if(receiverId) {
        Notification = await notificationRepository.getNotificationByReceiverId(String(receiverId));
      }

      else {
        Notification = await notificationRepository.getNotification(pageNoNumber, limitNumber);
      }

      if (!Notification) {
        return res.status(404).json({ error: "Notificationes not found" });
      }

      const response_data = FormateData(Notification);
      return res.status(200).json(response_data);
    } catch (error: any) {
      const response_data = FormateError(error);
      return res.status(500).json(response_data);
    }
  }

  // get Notification by id
  async getNotificationById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Get Notification
      const Notification = await notificationRepository.getNotificationById(id);
      if (!Notification) {
        return res.status(404).json({ error: "Notification not found" });
      }

      await notificationRepository.updateNotification({ _id: id, isRead: true });

      const response_data = FormateData(Notification);
      return res.status(200).json(response_data);
    } catch (error: any) {
      const response_data = FormateError(error);
      return res.status(500).json(response_data);
    }
  }

  // get Notification by id
  async getNotificationByReceiverId(req: any, res: Response) {
    try {
      const { _id: receiverId } = req.user;

      // Get Notification
      const Notification = await notificationRepository.getNotificationByReceiverId(receiverId);
      if (!Notification) {
        return res.status(404).json({ error: "Notification not found" });
      }

      const response_data = FormateData(Notification);
      return res.status(200).json(response_data);
    } catch (error: any) {
      const response_data = FormateError(error);
      return res.status(500).json(response_data);
    }
  }
}

export default NotificationService;
