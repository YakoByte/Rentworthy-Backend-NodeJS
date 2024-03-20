import { Express, Request, Response, NextFunction } from 'express';
import CancelBookingService from '../services/cancelBooking';
import UserAuth from '../middlewares/auth';
import { AuthenticatedRequest, postAuthenticatedRequest, updateAuthenticatedRequest, approveAuthenticatedRequest, deleteAuthenticatedRequest, getCountAuthenticatedRequest } from '../interface/cancelBooking';

export default (app: Express) => {
    const service = new CancelBookingService();

    // API = create new cancleBooking
    app.post('/create-cancel-booking', UserAuth, async (req: postAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;
            console.log("req.body", req.body)
            const data = await service.CreateCancelBooking(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = get cancleBooking by id and search and all cancleBooking
    app.get('/get-cancel-booking', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser = req.user as { _id: string; roleName: string; email: string; };
            req.query.user = authUser;

            const data = await service.getCancelBooking({ ...req.query });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = update cancleBooking by id
    app.put('/update-cancel-booking-by-id', UserAuth, async (req: updateAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const data = await service.updateCancelBookingById({ ...req.body, ...req.query });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    //API = approve and reject cancleBooking
    app.put('/approve-reject-cancel-booking', UserAuth, async (req: approveAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser = req.user as { _id: string; roleName: string; email: string; };
            let status
            if (req.body.isApproved === true) {
                status = "approved"
            } else {
                status = "rejected"
            }
            const data = await service.approveCancelBooking({ ...req.body, status, ...req.query, approvedBy: authUser._id });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    //API = delete cancleBooking
    app.delete('/delete-cancel-booking', UserAuth, async (req: deleteAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {

            const data = await service.deleteCancelBooking({ ...req.query });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    //API = count cancleBooking by every minutes   
    app.get('/get-cancel-booking/statiscs', UserAuth, async (req: getCountAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            let criteria = req.query.criteria
            const data = await service.getCountOfCancellation(criteria);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    }); 
};
