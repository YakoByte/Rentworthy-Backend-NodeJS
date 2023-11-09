import { Express, Request, Response, NextFunction } from 'express';
import BookingService from '../services/booking';
import UserAuth from '../middlewares/auth';
import { isAdmin } from '../middlewares/checkRole';
import { AuthenticatedRequest, bookingRequest, postAuthenticatedRequest, approveAuthenticatedRequest, deleteAuthenticatedRequest } from '../interface/booking';
import upload from '../middlewares/imageStorage';
// import multer from 'multer';
// import path from 'path';
// import { validateCreateAdmin } from './adminValidation';

export default (app: Express) => {
    const service = new BookingService();

    // API = create new booking
    app.post('/create-booking', UserAuth, upload.array("images", 10), async (req: postAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;
            console.log("req.body", req.body)
            const data = await service.CreateBooking(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = get booking by id and search and all booking
    app.get('/get-booking', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser = req.user as { _id: string; roleName: string; email: string; };
            // req.query.user = authUser;
            console.log("req.query", req.query)
            const { data } = await service.getBooking({ ...req.query, user: authUser });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
    // API = add images to booking
    app.post('/add-images-to-booking', UserAuth, upload.array("images", 10), async (req: postAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const data = await service.addImagesToBooking(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
    // API = remove images from booking
    app.post('/remove-images-from-booking', UserAuth, async (req: postAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const data = await service.removeImagesFromBooking(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = update booking by id
    app.put('/update-booking-by-id', UserAuth, async (req: postAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const data = await service.updateBookingById(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    //API = approve and reject booking
    app.put('/approve-reject-booking', UserAuth, async (req: approveAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser = req.user as { _id: string; roleName: string; email: string; };
            const data = await service.approveBooking({ ...req.body, acceptedBy: authUser._id });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    //API = delete booking
    app.delete('/delete-booking', UserAuth, async (req: deleteAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {

            const data = await service.deleteBooking({ ...req.query });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

};
