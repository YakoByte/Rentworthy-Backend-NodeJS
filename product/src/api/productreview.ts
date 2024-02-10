import { Express, Request, Response, NextFunction } from 'express';
import UserAuth from '../middlewares/auth';
import { AuthenticatedRequest } from '../interface/productreview';
import ProductReviewService from '../services/productreview';


export default (app: Express) => {
    const service = new ProductReviewService();

    // API = create new product Review
    app.post('/create-productreview', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            req.body.userId = req.user._id;
            req.body.token = req.headers.authorization
            const data = await service.CreateProductReview(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = get product Review by either userwise or productwise
    app.get('/get-productreview', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const data = await service.getProductReview(req.query);
            return res.json(data);
        } catch (err: any) {
            return res.status(err.STATUS_CODE).json(err);
        }
    });

    app.get('/get-all-productreview', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { productId } = req.query as { productId: string };
            const { page = 0, limit = 0 } = req.query as { page?: number; limit?: number }; // Providing default values here
            const data = await service.getAllProductReview({ productId, page, limit });
            return res.json(data);
        } catch (err: any) {
            return res.status(err.STATUS_CODE).json(err);
        }
    });
}