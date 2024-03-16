import { Express, Request, Response, NextFunction } from 'express';
import ProductService from '../services/product';
import UserAuth from '../middlewares/auth';
import { isAdmin } from '../middlewares/checkRole';
import { AuthenticatedRequest } from '../interface/product';
import upload from '../middlewares/imageStorage';
import imageService from '../services/imageUpload';
// import axios from 'axios';
// import fs from 'fs';
// import FormData from 'form-data';

// async function uploadMultipleImagesWithToken(imagePaths: string[], token: string): Promise<string[]> {
//     console.log("uploadMultipleImagesWithToken", imagePaths, token);
    
//     const formData = new FormData();

//     for (const imagePath of imagePaths) {
//         formData.append('image', fs.createReadStream(imagePath));
//     }

//     try {
//         const response = await axios.post("https://backend.rentworthy.us/web/api/v1/upload/image-uploads", formData, {
//             headers: {
//                 ...formData.getHeaders(),
//                 Authorization: token,
//             },
//         });
    
//         const paths: string[] = response.data.map((element: any) => element._id);

//         imagePaths.forEach(async (element: any) => {
//             if (fs.existsSync(element)) {
//               fs.unlinkSync(element);
//             }
//         });

//         return paths;
//     } catch (error: any) {
//         imagePaths.forEach(async (element: any) => {
//             if (fs.existsSync(element)) {
//               fs.unlinkSync(element);
//             }
//         });
//         return [error.message]; // Return an array to match the Promise<string[]> type
//     }
// }

export default (app: Express) => {
    const service = new ProductService();
    const image = new imageService();

    // API = create new product
    app.post('/create-product', UserAuth, upload.array('images', 10), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {       
            let authUser: any = req.user
            req.body.userId = authUser._id;
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
            
            if (!req.body.isDeliverable || req.body.isDeliverable === "false") {
                delete req.body.Distance;
            }
            
            delete req.body.startDate
            delete req.body.endDate

            const imageData = {
                userId: req.user._id,
                imageDetails: req.files,
            }

            req.body.images = await image.CreateImages(imageData);

            // req.body.images = await uploadMultipleImagesWithToken(req.files.map((obj: { path: any; }) => obj.path), req.headers.authorization);
            console.log(req.body.images);
            
            const data = await service.CreateProduct(req.body);
            return res.status(200).json(data);
        } catch (err: any) {
            console.log('went like this-----', err)
            return res.status(err.STATUS_CODE).json(err);
            // next(err);
        }
    });

    app.get('/guest-product', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const data = await service.getProduct({...req.query});
            return res.status(200).json(data);
        } catch (err: any) {
            console.log('went in',err)
            return res.status(500).json(err);
        }
    });

    // // API = get product by id and search and all product
    app.get('/get-product', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            req.query = {...req.query}
            let authUser: any = req.user
            req.query.userId = authUser._id;
            req.query.token = req.headers.authorization || '';
            req.query.roleName = authUser.roleName;

            const data = await service.getProduct(req.query);
            return res.status(200).json(data);
        } catch (err: any) {
            console.log('went in',err)
            return res.status(500).json(err);
        }
    });

    // // API = update product
    app.put('/update-product', UserAuth, upload.array('images', 10), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;

            let coordinate = JSON.parse(req.body['location.coordinates'])
            delete req.body['location.coordinates']
            req.body.location = {
                type: "Point",
                coordinates: coordinate
            }
            
            if (req.files.length > 0) { 
                const imageData = {
                    userId: req.user._id,
                    imageDetails: req.files,
                }
    
                req.body.images = await image.CreateImages(imageData);
                // req.body.images = await uploadMultipleImagesWithToken(req.files.map((obj: { path: any; }) => obj.path), req.headers.authorization);
            }
            
            const data = await service.updateProduct({ ...req.body, userId: authUser._id, _id: req.query._id });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // // API = admin approve product
    app.put('/approve-product', UserAuth, isAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;
            const data = await service.approveProduct({ _id: req.query._id as string, isVerified: req.query.isVerified as string, approvedBy: authUser._id, });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // // API = delete product
    app.delete('/delete-product', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;
            console.log("req.body", req.query)
            const data = await service.deleteProduct(req.query);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = get userData
    app.get('/get-user-product', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user

            const data = await service.getProductByUserId({ userId: authUser._id });
            return res.status(200).json(data);
        } catch (err: any) {
            console.log('went in',err)
            return res.status(500).json(err);
        }
    });
};
