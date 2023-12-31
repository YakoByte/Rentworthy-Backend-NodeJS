import { Express, Request, Response, NextFunction } from 'express';
import BookingService from '../services/booking';
import UserAuth from '../middlewares/auth';
import { isAdmin } from '../middlewares/checkRole';
import { AuthenticatedRequest, bookingRequest, postAuthenticatedRequest, approveAuthenticatedRequest, deleteAuthenticatedRequest } from '../interface/booking';
import upload from '../middlewares/imageStorage';
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import { FormateData } from '../utils';

// import multer from 'multer';
// import path from 'path';
// import { validateCreateAdmin } from './adminValidation';
async function uploadMultipleImagesWithToken(imagePaths: string[], token: string): Promise<void> {
    const formData = new FormData();

    // Append each image file to the FormData object
    for (const imagePath of imagePaths) {
        formData.append('image', fs.createReadStream(imagePath));
    }

    try {
        const response = await axios.post("http://localhost:5000/app/api/v1/upload/image-uploads", formData, {
            headers: {
                ...formData.getHeaders(),
                Authorization: token, // Add the token to the Authorization header
            },
        });
        return response.data.existingImage.map((obj: { _id: any; }) => obj._id);
    } catch (error: any) {
        return error.message;
    }
}

async function uploadImageWithToken(imagePath: string, token: string): Promise<string> {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));

    try {
        const response = await axios.post("http://localhost:5000/app/api/v1/upload/image-upload", formData, {
            headers: {
                ...formData.getHeaders(),
                Authorization: token,
            },
        });
        return response.data.existingImage._id; // Assuming you are expecting a single image ID
    } catch (error: any) {
        return error.message;
    }
}

async function deleteImageWithToken(id: string, token: string): Promise<string> {
    try {
        console.log(id, token);

        const response = await axios.delete(`http://localhost:5000/app/api/v1/upload/image-delete/${id}`, {
            headers: {
                Authorization: token,
            },
        });
        return response.data; // Assuming you are expecting a single image ID
    } catch (error: any) {
        return error.message;
    }
}

export default (app: Express) => {
    const service = new BookingService();

    // API = create new booking
    app.post('/create-booking', UserAuth, upload.array("images", 10), async (req: postAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;

            if (req.file) {
                req.body.images = await uploadImageWithToken(req.file.path, req.headers.authorization) as any;
            } else {
                return res.status(400).json({ error: "No file provided" });
            }
            console.log("req.body", req.body)
            const data = await service.CreateBooking(req.body, req);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
    //API = get recent booking
    app.get('/get-recent-booking', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            // let authUser = req.user as { _id: string; roleName: string; email: string; };
            // req.query.user = authUser;
            console.log("req.query", req.query)
            const { data } = await service.getRecentBooking(req.query);
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

    // API = update booking for preRentelScreen
    app.put('/update-booking-for-preRentelScreen', UserAuth,
        upload.fields([
            { name: 'preRentalScreening[0][images]', maxCount: 10 },
            { name: 'preRentalScreening[1][images]', maxCount: 10 },
            { name: 'preRentalScreening[2][images]', maxCount: 10 },
            // Add more as needed for each object in the preRentalScreening array
        ]),
        async (req: postAuthenticatedRequest, res: Response, next: NextFunction) => {
            try {
                console.log("req.body", req.files)
                let images = req.files as any;
                for (let i = 0; i < req.body.preRentalScreening.length; i++) {
                    // const element = req.body.preRentalScreening[i];
                    if (images[`preRentalScreening[${i}][images]`]) {
                        req.body.preRentalScreening[i].images = await uploadMultipleImagesWithToken(images[`preRentalScreening[${i}][images]`].map((obj: { path: any; }) => obj.path), req.headers.authorization) as any;
                    } else {
                        return res.status(400).json({ error: "No file provided" });
                    }
                }
                // if (images['preRentalScreening[0][images]']) {

                //     // req.body.images = await uploadImageWithToken(req.file.path, req.headers.authorization) as any;
                // } else {
                //     return res.status(400).json({ error: "No file provided" });
                // }
                // call image upload api
                let authUser: any = req.user
                req.body.userId = authUser._id;
                console.log("req.body", req.body)
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
            const data = await service.approveBooking({ ...req.body, acceptedBy: authUser._id }, req);
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
