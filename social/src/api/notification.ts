
import { Express, Request, Response, NextFunction } from 'express';
import NotificationService from '../services/notification';
import UserAuth from '../middlewares/auth';
import { isAdmin } from '../middlewares/checkRole';
import { AuthenticatedRequest, notificationRequest, deleteAuthenticatedRequest, } from '../interface/notification';
import upload from '../middlewares/imageStorage';
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
// import multer from 'multer';
// import path from 'path';
// import { validateCreateAdmin } from './adminValidation';


export default (app: Express) => {
    const service = new NotificationService();

    // API = create new Notification
    app.post('/create-notification', UserAuth, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await service.CreateNotification(req.body as notificationRequest);
            res.status(200).json(result);
        } catch (err: any) {
            next(err);
        }
    });

    // API = get Notification by id
    app.get('/get-notification', UserAuth, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await service.getNotification(req.query);
            res.status(200).json(result);
        } catch (err: any) {
            next(err);
        }
    });

    // API = update Notification by id  
    app.put('/update-notification-by-id', UserAuth, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await service.updateById({ ...req.body, ...req.query });
            res.status(200).json(result);
        } catch (err: any) {
            next(err);
        }
    });

    // API = delete Notification by id
    app.delete('/delete-notification-by-id', UserAuth, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await service.deleteNotification({ ...req.body, ...req.query });
            res.status(200).json(result);
        } catch (err: any) {
            next(err);
        }
    });
};
