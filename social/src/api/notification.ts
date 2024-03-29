import { Express, Request, Response, NextFunction } from 'express';
import NotificationService from '../services/notification';
import UserAuth from "../middlewares/auth";

export default (app: Express) => {
    const notificationService = new NotificationService();

    // create Notification
    app.post('/notification', UserAuth, notificationService.createNotification);

    // update Notification
    app.put('/notification', UserAuth, notificationService.updateNotification);

    // delete Notification
    app.delete('/notification/:id', UserAuth, notificationService.deleteNotification);

    // get Notification
    app.get('/notification', UserAuth, notificationService.getNotifications);

    // get Notification by Id
    app.get('/notification/user', UserAuth, notificationService.getNotificationByReceiverId);

    // get Notification by Id
    app.get('/notification/:id', UserAuth, notificationService.getNotificationById);
}