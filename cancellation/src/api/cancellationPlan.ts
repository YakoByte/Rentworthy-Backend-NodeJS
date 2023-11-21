import { Express, Request, Response, NextFunction } from 'express';
import CancellationPlanService from '../services/cancellationPlan';
import UserAuth from '../middlewares/auth';
import { isAdmin } from '../middlewares/checkRole';
import { AuthenticatedRequest, cancellationPlanRequest, postAuthenticatedRequest, updateAuthenticatedRequest, deleteAuthenticatedRequest } from '../interface/cancellationPlan';
import upload from '../middlewares/imageStorage';
// import multer from 'multer';
// import path from 'path';
// import { validateCreateAdmin } from './adminValidation';

export default (app: Express) => {
    const service = new CancellationPlanService();

    // API = create new cancellationPlan
    app.post('/create-cancellationPlan', UserAuth, upload.array("images", 10), async (req: postAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            console.log("req.body", req.body)
            const data = await service.CreateCancellationPlan({ ...req.body, createdBy: authUser._id });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = get cancellationPlan by id and search and all cancellationPlan
    app.get('/get-cancellationPlan', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser = req.user as { _id: string; roleName: string; email: string; };
            // req.query.user = authUser;
            console.log("req.query", req.query)
            const { data } = await service.getCancellationPlan(req.query);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = update cancellationPlan by id
    app.put('/update-cancellationPlan-by-id', UserAuth, async (req: updateAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const data = await service.updateCancellationPlanById({ ...req.body, ...req.query });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    //API = delete cancellationPlan
    app.delete('/delete-cancellationPlan', UserAuth, async (req: deleteAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {

            const data = await service.deleteCancellationPlan({ ...req.query });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

};
