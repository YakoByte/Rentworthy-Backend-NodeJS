import { Express, Request, Response, NextFunction } from 'express';
import UserAuth from '../middlewares/auth';
import { AuthenticatedRequest } from '../interface/productreservation';
import ProductReservationService from '../services/productreservation';


export default (app: Express) => {
    const service = new ProductReservationService();

    // API = create new product reservation
    app.post('/create-productreservation', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            req.body.userId = req.user._id;
            const data = await service.CreateProductReservation(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = update product reservation
    app.post('/update-productreservation', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            req.body.userId = req.user._id;
            const data = await service.UpdateProductReservation(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = update product reservation self
    app.post('/update-productreservationself', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            req.body.userId = req.user._id;
            const data = await service.UpdateProductReservationSelf(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });


    app.post('/update-relieveproductreservation', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            req.body.userId = req.user._id;
            const data = await service.RelieveProductReservation(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = get available dates
    app.post('/get-availabledates', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            req.body.userId = req.user._id;
            const data = await service.getProductAvailable(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
}