import { Express, Request, Response, NextFunction } from 'express';
import BusinessService from '../services/business';
import UserAuth from '../middlewares/auth';
import { AuthenticatedRequest } from '../interface/business';
import { isAdmin } from '../middlewares/checkRole';

export default (app: Express) => {
    const service = new BusinessService();
    // API = create new business info
    app.post('/create-business', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        let authUser: any = req.user
        req.body.userId = authUser._id;
        try {
            const data = await service.createBusiness(req.body);
            return res.json(data);
        } catch (err) {
            console.log(err)
           return res.status(500).json({
            error:"something went wrong"
           })
        }
    });

     // API = approve/reject business info
     app.put('/approval-business', UserAuth, isAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const data = await service.approveRejectBusiness(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

     // API = get business info
     app.get('/get-business', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const data = await service.getBusiness(req.query);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
};
