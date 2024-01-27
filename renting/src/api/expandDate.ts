import { Express, Request, Response, NextFunction } from 'express';
import ExpandDateService from '../services/expandDates';
import UserAuth from '../middlewares/auth';
import { isAdmin } from '../middlewares/checkRole';
import { AuthenticatedRequest, expandDateRequest, postAuthenticatedRequest, approveAuthenticatedRequest, deleteAuthenticatedRequest } from '../interface/expandDate';
import upload from '../middlewares/imageStorage';
// import multer from 'multer';
// import path from 'path';
// import { validateCreateAdmin } from './adminValidation';

export default (app: Express) => {
    const service = new ExpandDateService();

    // API = create new expandDate
    app.post('/create-expand-date', UserAuth, upload.array("images", 10), async (req: postAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;
            const data = await service.CreateExpandDate(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = get expandDate by id and search and all expandDate
    app.get('/get-expand-date', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser = req.user as { _id: string; roleName: string; email: string; };
            const data = await service.getExpandDate({ ...req.query, user: authUser });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
    // API = add images to expandDate
    app.post('/add-images-to-expand-date', UserAuth, upload.array("images", 10), async (req: postAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const data = await service.addImagesToExpandDate(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
    // API = remove images from expandDate
    app.post('/remove-images-from-expand-date', UserAuth, async (req: postAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const data = await service.removeImagesFromExpandDate(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = update expandDate by id
    app.put('/update-expand-date-by-id', UserAuth, async (req: postAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const data = await service.updateExpandDateById(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    //API = approve and reject expandDate
    app.put('/approve-reject-expand-date', UserAuth, async (req: approveAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser = req.user as { _id: string; roleName: string; email: string; };
            const data = await service.approveExpandDate({ ...req.body, acceptedBy: authUser._id });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    //API = delete expandDate
    app.delete('/delete-expand-date', UserAuth, async (req: deleteAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {

            const data = await service.deleteExpandDate({ ...req.query });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
};
