import { Express, Request, Response, NextFunction } from 'express';
import WishlistService from '../services/wishlist';
import UserAuth from '../middlewares/auth';
import { isAdmin } from '../middlewares/checkRole';
import { AuthenticatedRequest } from '../interface/wishlist';
import upload from '../middlewares/imageStorage';
// import multer from 'multer';
// import path from 'path';
// import { validateCreateAdmin } from './adminValidation';

export default (app: Express) => {
    const service = new WishlistService();

    // API = create new wishlist
    app.post('/create-wishlist', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;
            const data = await service.CreateWishlist(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = get wishlist by id and search and all wishlist
    app.get('/get-wishlist', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.query.userId = authUser._id;

            const data = await service.getWishlist(req.query);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = add product to wishlist
    app.post('/add-product-to-wishlist', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;
            req.body._id = req.query._id;
            console.log("req.body", req.body)
            const data = await service.addProductToWishlist(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
     
    // API = remove product from wishlist
    app.delete('/remove-product-from-wishlist', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;
            req.body._id = req.query._id;
            console.log("req.body", req.body)
            const data = await service.removeProductFromWishlist(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = delete wishlist
    app.delete('/delete-wishlist', UserAuth, isAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;
            console.log("req.body", req.query)
            const data = await service.deleteWishlist(req.query);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
};
