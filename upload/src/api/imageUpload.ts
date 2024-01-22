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
            const data  = await service.CreateImage(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.post('/image-uploads', UserAuth, upload.array("image"), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;
            req.body.imageDetails = req.files;
            const data = await service.CreateImages(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = image delete
    app.delete('/image-delete/:id', UserAuth, isAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const data = await service.DeleteImage(req.params.id);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = image delete by imageName url
    app.delete('/image-name-delete', UserAuth, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await service.DeleteImageByName(req.body.imageName);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
};
