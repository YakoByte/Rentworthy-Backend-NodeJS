import { Express, Request, Response, NextFunction } from 'express';
import UserAuth from '../middlewares/auth';
import { AuthenticatedRequest } from '../interface/productrating';
import ProductRatingService from '../services/productrating';


export default (app: Express) => {
    const service = new ProductRatingService();

    // API = create new product rating
    app.post('/create-productrating', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            req.body.userId = req.user._id;
            const { data } = await service.CreateProductRating(req.body, req);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // // API = get product rating by either userwise or productwise
    app.get('/get-productrating', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const data = await service.getProductRating({ ...req.query, userId: req.user._id });
            return res.json(data);
        } catch (err: any) {
            return res.status(err.STATUS_CODE).json(err);
        }
    });
}