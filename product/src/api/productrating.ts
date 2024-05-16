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
            req.body.token = req.headers.authorization
            const data = await service.CreateProductRating(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // // API = get product rating by either userwise or productwise
    app.get('/get-productrating', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const data = await service.getProductRating(req.query);
            return res.json(data);
        } catch (err: any) {
            return res.status(err.STATUS_CODE).json(err);
        }
    });

    app.get('/get-all-productrating', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { productId } = req.query as { productId: string };
            const { page = 0, limit = 0 } = req.query as { page?: number; limit?: number }; // Providing default values here
            const data = await service.getAllProductRating({ productId, page, limit });
            return res.json(data);
        } catch (err: any) {
            return res.status(err.STATUS_CODE).json(err);
        }
    });

    app.get('/get-productrating/stastics', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { productId } = req.query as { productId: string };
            const data = await service.getProductRatingCount({ productId });
            return res.json(data);
        } catch (err: any) {
            return res.status(err.STATUS_CODE).json(err);
        }
    });
}