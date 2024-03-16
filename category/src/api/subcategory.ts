import { Express, Request, Response, NextFunction } from 'express';
import SubCategoryService from '../services/subCategory';
import UserAuth from '../middlewares/auth';
import { isAdmin } from '../middlewares/checkRole';
import { AuthenticatedRequest } from '../interface/category';
import imageService from '../services/imageUpload';
import upload from '../middlewares/imageStorage';

export default (app: Express) => {
    const service = new SubCategoryService();
    const image = new imageService();

    // API = create new subCategory
    app.post('/create-subcategory', UserAuth, isAdmin, upload.single('image'), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            // console.log("req.file", req.file)
            let authUser: any = req.user
            req.body.userId = authUser._id;

            if(req.file) {
                const imageData = {
                    userId: authUser._id,
                    imageDetail: req.file
                }
    
                req.body.image = await image.CreateImage(imageData);
            }

            const data = await service.CreateSubCategory(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = get subCategory by id and search and all subCategory
    app.get('/get-subcategory', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const data = await service.getSubCategory(req.query);
            return res.json(data);
        } catch (err) {
            return (err);
        }
    });

    // API = update subCategory
    app.put('/update-subcategory', UserAuth, isAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;
            req.body._id = req.query._id;
            const data = await service.updateSubCategory(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = delete subCategory
    app.delete('/delete-subcategory', UserAuth, isAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.query.userId = authUser._id;
            const data = await service.deleteSubCategory(req.query);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
};
