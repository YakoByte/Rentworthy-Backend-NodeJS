import { NotificationModel } from "../models";
import { ObjectId } from 'mongodb';
import { FormateData } from '../../utils';
import { APIError, BadRequestError, STATUS_CODES } from "../../utils/app-error";
import { notificationRequest, notificationUpdateRequest } from "../../interface/notification";

class NotificationRepository {
    //create Notification
    async CreateNotification(NotificationInputs: notificationRequest) {
        try {
            const NotificationResult = await NotificationModel.create(NotificationInputs);
            if (NotificationResult) {
                return NotificationResult;
            }
            return FormateData("Failed to create Notification");
        } catch (err: any) {
            console.log("repository err", err)
            return ({ message: "Data Not found", err });
        }
    }
    //get all Notification
    async getNotificationById(NotificationInputs: notificationRequest) {
        try {
            const NotificationResult = await NotificationModel.findById(NotificationInputs._id);
            if (!NotificationResult) {
                return FormateData("No Notification");
            }
            return FormateData(NotificationResult);
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    //get all Notification
    async getAllNotification() {
        try {
            const NotificationResult = await NotificationModel.find();
            if (!NotificationResult) {
                return FormateData("No Notification");
            }
            return FormateData(NotificationResult);
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    //get one Notification
    async getNotification(NotificationInputs: notificationRequest) {
        try {
            const NotificationResult = await NotificationModel.find({ title: NotificationInputs.title });
            if (!NotificationResult) {
                return FormateData("No Notification");
            }
            return FormateData(NotificationResult);
        } catch (err: any) {
            console.log("err", err)
            throw new APIError("Data Not found", err);
        }
    }
    //update Notification by id
    async updateNotificationById(NotificationInputs: notificationUpdateRequest) {
        const NotificationResult = await NotificationModel.findOneAndUpdate(
            { _id: NotificationInputs._id, isDeleted: false },
            { $set: NotificationInputs },
            { new: true });

        if (NotificationResult) {
            return FormateData(NotificationResult);
        }
    }
    //delete Notification by id
    async deleteNotificationById(NotificationInputs: { _id: string }) {
        const NotificationResult = await NotificationModel.findOneAndUpdate(
            { _id: NotificationInputs._id, isDeleted: false },
            { isDeleted: true },
            { new: true });
        if (NotificationResult) {
            return FormateData("Notification Deleted");
        }
    }
}

export default NotificationRepository;
