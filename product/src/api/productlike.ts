import { Express, Request, Response, NextFunction } from 'express';
import UserAuth from '../middlewares/auth';
import { AuthenticatedRequest } from '../interface/productlike';
import ProductLikeService from '../services/productlike';


export default (app: Express) => {
    const service = new ProductLikeService();

    // API = create new product
    app.post('/create-productlike', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            req.body.userId = req.user._id;
            const { data } = await service.CreateProductLike(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // // API = get productlikes by either userwise or productwise
    app.get('/get-productlikes', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const data = await service.getProductlike({ ...req.query, userId: req.user._id });
            return res.json(data);
        } catch (err: any) {
            return res.status(err.STATUS_CODE).json(err);
        }
    });

    app.get('/get-all-productlike', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { productId } = req.query as { productId: string };
            const { page = 0, limit = 0 } = req.query as { page?: number; limit?: number }; // Providing default values here
            const data = await service.getAllProductLike({ productId, page, limit });
            return res.json(data);
        } catch (err: any) {
            return res.status(err.STATUS_CODE).json(err);
        }
    });

    app.get('/get-productlike/stastics', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { productId } = req.query as { productId: string };
            const data = await service.getProductLikeCount({ productId });
            return res.json(data);
        } catch (err: any) {
            return res.status(err.STATUS_CODE).json(err);
        }
    });
}