import { Express, Request, Response, NextFunction } from 'express';
import BookingService from '../services/booking';
import UserAuth from '../middlewares/auth';
import { isAdmin } from '../middlewares/checkRole';
import { AuthenticatedRequest, postAuthenticatedRequest, approveAuthenticatedRequest, deleteAuthenticatedRequest } from '../interface/booking';
import upload from '../middlewares/imageStorage';
import { FormateData } from '../utils';
import imageService from '../services/imageUpload';

export default (app: Express) => {
    const service = new BookingService();
    const image = new imageService();

    // API = create new booking
    app.post('/create-booking', UserAuth, upload.array("images", 10), async (req: postAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;
            req.body.status = 'Requested'
            if (req.files.length > 0) {    
                const imageData = {
                    userId: authUser._id,
                    imageDetails: req.files,
                  }
        
                  req.body.images = await image.CreateImages(imageData) as unknown as string[];;            
            }
            const data = await service.CreateBooking(req.body, req);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    //API = get recent booking
    app.get('/get-recent-booking', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser = req.user as { _id: string; roleName: string; email: string; };
            const data = await service.getRecentBooking({ ...req.query, user: authUser });
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

            const data = await service.getBooking({ ...req.query, user: authUser });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = add images to booking
    app.post('/add-images-to-booking', UserAuth, upload.array("images", 10), async (req: postAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;

            if (req.files.length > 0) {    
                const imageData = {
                    userId: authUser._id,
                    imageDetails: req.files,
                  }
        
                  req.body.images = await image.CreateImages(imageData) as unknown as string[];;            
            }

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
            if(req.body.isAccepted === true){
                req.body.status = 'Confirmed'
            } else {
                req.body.status = 'Rejected';
            }
            const data = await service.updateBookingById(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = update booking for preRentelScreen
    // app.put('/update-booking-for-preRentelScreen', UserAuth,
    //     upload.fields([
    //         { name: 'preRentalScreening[0][images]', maxCount: 10 },
    //         { name: 'preRentalScreening[1][images]', maxCount: 10 },
    //         { name: 'preRentalScreening[2][images]', maxCount: 10 },
    //     ]),
    //     async (req: postAuthenticatedRequest, res: Response, next: NextFunction) => {
    //         try {
    //             console.log("req.body", req.files)
    //             let images = req.files as any;
    //             for (let i = 0; i < req.body.preRentalScreening.length; i++) {
    //                 if (images[`preRentalScreening[${i}][images]`]) {
    //                     req.body.preRentalScreening[i].images = await uploadMultipleImagesWithToken(images[`preRentalScreening[${i}][images]`].map((obj: { path: any; }) => obj.path), req.headers.authorization) as any;
    //                 } else {
    //                     return res.status(400).json({ error: "No file provided" });
    //                 }
    //             }

    //             // call image upload api
    //             let authUser: any = req.user
    //             req.body.userId = authUser._id;
    //             console.log("req.body", req.body)
    //             const data = await service.updatePreRentalScreeningById(req.body);
    //             return res.json(data);
    //         } catch (err) {
    //             return FormateData(err);
    //         }
    //     });

    app.put('/update-booking-for-preRentelScreen', UserAuth,
    upload.fields([
        { name: 'images0', maxCount: 10 },
        { name: 'images1', maxCount: 10 },
        { name: 'images2', maxCount: 10 },
    ]),
    async (req: postAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user;
            req.body.userId = authUser._id;
            req.body._id = String(req.query.bookingId);


            let images = req.files as any;
            let body = req.body as any;
            req.body.preRentalScreening = [];

            for (let i = 0; i < Object.keys(body).length / 3 - 1; i++) {
                // Create an object for each set of question, answer, and ansBoolean
                const screeningItem = {
                    question: body[`question${i}`],
                    answer: body[`answer${i}`],
                    ansBoolean: body[`ansBoolean${i}`],
                    images: [] as string[],
                };

                // Add the images if available
                if (images[`images${i}`]) {
                    const imageData = {
                        userId: authUser._id,
                        imageDetails: images[`images${i}`],
                    }

                    screeningItem.images = await image.CreateImages(imageData) as unknown as string[];
                }

                req.body.preRentalScreening.push(screeningItem);
            }
           
            const data = await service.updatePreRentalScreeningById(req.body);
            return res.json(data);
        } catch (err) {
            return FormateData(err);
        }
    });

    //API = approve and reject booking
    app.put('/approve-reject-booking', UserAuth, async (req: approveAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser = req.user as { _id: string; roleName: string; email: string; };
            if(req.body.isAccepted === true){
                req.body.status = 'Confirmed'
            } else {
                req.body.status = 'Rejected';
            }
            const data = await service.approveBooking({ ...req.body, acceptedBy: authUser._id }, req);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    //API = delete booking
    app.delete('/delete-booking', UserAuth, async (req: deleteAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            req.query.status = 'Cancelled'
            const data = await service.deleteBooking({ ...req.query });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    //API = count Booking
    app.get('/count-product-booking', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const data = await service.CountProductBooking({productId: req.query.productId || ''});
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.get('/count-user-booking', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser = req.query._id || req.user?._id 
            const data = await service.CountUserBooking({userId: authUser || ''});
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.get('/count-user-product-booking', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser = req.query._id || req.user?._id 
            const data = await service.CountUsersProductBooking({userId: authUser || ''});
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.get('/dummy-booking', UserAuth, async (req: deleteAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const data = await service.dummyAPI();
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
};
