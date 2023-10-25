import { Express, Request, Response, NextFunction } from 'express';
import SubCategoryService from '../services/subCategory';
import UserAuth from '../middlewares/auth';
import { isAdmin } from '../middlewares/checkRole';
import { AuthenticatedRequest } from '../interface/category';
// import { validateCreateAdmin } from './adminValidation';

export default (app: Express) => {
    const service = new SubCategoryService();

    // API = create new subCategory
    app.post('/create-subcategory', UserAuth, isAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;
            console.log("req.body", req.body)
            const { data } = await service.CreateSubCategory(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = get subCategory by id and search and all subCategory
    app.get('/get-subcategory', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;
            console.log("req.body", req.query)

            const { data } = await service.getSubCategory(req.query);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = update subCategory
    app.put('/update-subcategory', UserAuth, isAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;
            req.body._id = req.query._id;
            console.log("req.body", req.body)
            const { data } = await service.updateSubCategory(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = delete subCategory
    app.delete('/delete-subcategory', UserAuth, isAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;
            console.log("req.body", req.query)
            const { data } = await service.deleteSubCategory(req.query);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
};
