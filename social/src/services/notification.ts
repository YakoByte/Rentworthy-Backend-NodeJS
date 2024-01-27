import NotificationRepository from '../database/repository/notification';
import { FormateData, FormateError } from '../utils';

import { notificationRequest, notificationUpdateRequest, notificationGetRequest, notificationDeleteRequest } from '../interface/notification';

// All Business logic will be here
class NotificationService {
    private repository: NotificationRepository;

    constructor() {
        this.repository = new NotificationRepository();
    }
    // create Notification
    async CreateNotification(NotificationInputs: notificationRequest) {
        try {
            console.log("NotificationInputs", NotificationInputs)
            const existingNotification: any = await this.repository.CreateNotification(
                NotificationInputs
            );

            return FormateData(existingNotification);
        } catch (err: any) {
            return FormateError({ error: "Failed to Create NOtification" });
        }
    }
    // get Notification by id
    // async getNotificationById(NotificationInputs: notificationGetRequest) {
    //     try {
    //         let existingNotification = await this.repository.getNotificationById(
    //             NotificationInputs
    //         );

    //         return FormateData({ existingNotification });
    //     } catch (err: any) {
    //         console.log("err", err)
    //         throw new APIError("Data Not found", err);
    //     }
    // }
    // get All Notification
    // async getAllNotification(NotificationInputs: notificationGetRequest) {
    //     try {
    //         let existingNotification: any
    //         existingNotification = await this.repository.getAllNotification();

    //         return FormateData({ existingNotification });
    //     } catch (err: any) {
    //         console.log("err", err)
    //         throw new APIError("Data Not found", err);
    //     }
    // }
    // get Notification by id
    async getNotification(NotificationInputs: notificationRequest) {
        try {
            let existingNotification: any
            existingNotification = await this.repository.getNotification(
                NotificationInputs
            );

            return FormateData(existingNotification);
        } catch (err: any) {
            return FormateError({ error: "Failed to Get Notification" });
        }
    }
    // add images to Notification
    // async addImagesToNotification(NotificationInputs: notificationUpdateRequest) {
    //     try {
    //         const existingNotification: any = await this.repository.addImagesToNotification(
    //             NotificationInputs
    //         );

    //         return FormateData({ existingNotification });
    //     } catch (err: any) {
    //         console.log("err", err)
    //         throw new APIError("Data Not found", err);
    //     }
    // }
    // update Notification by id
    async updateById(NotificationInputs: notificationUpdateRequest) {
        try {
            const existingNotification: any = await this.repository.updateNotificationById(
                NotificationInputs
            );

            return FormateData(existingNotification);
        } catch (err: any) {
            return FormateError({ error: "Failed to update Notification" });
        }
    }

    // delete Notification by id  (soft delete)
    async deleteNotification(NotificationInputs: notificationDeleteRequest) {
        try {
            const existingNotification: any = await this.repository.deleteNotificationById(
                NotificationInputs
            );

            return FormateData(existingNotification);
        } catch (err: any) {
            return FormateError({ error: "Failed to Delete Notification" });
        }
    }

}

export = NotificationService;
