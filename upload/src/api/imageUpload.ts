import { Express, Request, Response, NextFunction } from 'express';
import ImageService from '../services/imageUpload';
import UserAuth from '../middlewares/auth';
import { isAdmin } from '../middlewares/checkRole';
import { AuthenticatedRequest } from '../interface/imageUpload';
import upload from '../middlewares/imageStorage';
// import { validateCreateAdmin } from './adminValidation';

export default (app: Express) => {
    const service = new ImageService();

    // API = create new image-upload
    app.post('/image-upload', UserAuth, upload.single("image"), isAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;
            req.body.imageDetail = req.file;
            console.log("req.body", req.body)
            const { data } = await service.CreateImage(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
};
