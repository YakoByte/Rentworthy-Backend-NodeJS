import { Express, Request, Response, NextFunction } from 'express';
import ProductService from '../services/product';
import UserAuth from '../middlewares/auth';
import { isAdmin } from '../middlewares/checkRole';
import { AuthenticatedRequest } from '../interface/product';
import upload from '../middlewares/imageStorage';
// import { func } from 'joi';
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
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




export default (app: Express) => {
    const service = new ProductService();


    // API = create new product
    app.post('/create-product', UserAuth, upload.array('images', 10), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            req.body.userId = req.user._id;
            req.body = { ...req.body }
            let coordinate = JSON.parse(req.body['location.coordinates'])
            delete req.body['location.coordinates']
            req.body.location = {
                type: "Point",
                coordinates: coordinate
            }
            req.body.rentingDate = {
                startDate: req.body.startDate,
                endDate: req.body.endDate
            }
            delete req.body.startDate
            delete req.body.endDate
            req.body.images = await uploadMultipleImagesWithToken(req.files.map((obj: { path: any; }) => obj.path), req.headers.authorization);
            const { data } = await service.CreateProduct(req.body);
            return res.status(200).json(data);
        } catch (err: any) {
            console.log('went like this-----', err)
            return res.status(err.STATUS_CODE).json(err);
            // next(err);
        }
    });

    // // API = get product by id and search and all product
    app.get('/get-product', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const data: { STATUS_CODE: number, data: [], message: string } = await service.getProduct({ ...req.query});
            return res.status(200).json(data);
        } catch (err: any) {
            console.log('went in',err)
            return res.status(500).json(err);
        }
    });

    // // API = update product
    app.put('/update-product', UserAuth, upload.array('images', 10), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            console.log("req.body", req.body)
            req.body.images = await uploadMultipleImagesWithToken(req.files.map((obj: { path: any; }) => obj.path), req.headers.authorization);
            console.log("req.body.images", req.body.images)
            const { data } = await service.updateProduct({ ...req.body, userId: req.user._id, _id: req.query._id });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // // API = admin approve product
    app.put('/approve-product', UserAuth, isAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            // req.body.approvedBy = req.user._id;
            // req.body._id = req.query._id;
            console.log("req.body", req.query)
            const data = await service.approveProduct({ _id: req.query._id as string, isVerified: req.query.isVerified as string, approvedBy: req.user._id, });
            console.log("data", data)
            return res.status(data.STATUS_CODES).json(data);
        } catch (err) {
            next(err);
        }
    });

    // // API = delete product
    app.delete('/delete-product', UserAuth, isAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;
            console.log("req.body", req.query)
            const { data } = await service.deleteProduct(req.query);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
};
