import { Express, Request, Response, NextFunction } from 'express';
import CategoryService from '../services/category';
import UserAuth from '../middlewares/auth';
import { isAdmin } from '../middlewares/checkRole';
import { AuthenticatedRequest } from '../interface/category';
import upload from '../middlewares/imageStorage';

// import upload from '../middlewares/imageStorage';
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
// import multer from 'multer';
// import path from 'path';
// import { validateCreateAdmin } from './adminValidation';

async function uploadImageWithToken(imagePath: string, token: string): Promise<string> {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));

    try {
        const response = await axios.post("https://backend.rentworthy.us/web/api/v1/upload/image-upload", formData, {
            headers: {
                ...formData.getHeaders(),
                Authorization: token,
            },
        });

        return response.data._id;
    } catch (error: any) {
        return error.message;
    }
}

export default (app: Express) => {
    const service = new CategoryService();

    // API = create new category
    app.post('/create-category', UserAuth, upload.single('image'), async (req: any, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;
         
            req.body.image = await uploadImageWithToken(req.file.path, req.headers.authorization);
            
            // console.log("req.body", req.body)
            console.log("req.body", req.body)
            const data = await service.CreateCategory(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = get category by id and search and all category
    app.get('/get-category', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { data } = await service.getCategory(req.query);
            return res.json(data);
        } catch (err) {
            console.log("err", err)
            return (err);
        }
    });

    // API = update category
    app.put('/update-category', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;
            req.body._id = req.query._id;
            console.log("req.body", req.body)
            const data = await service.updateCategory(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = delete category
    app.delete('/delete-category', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;
            console.log("req.body", req.query)
            const data = await service.deleteCategory(req.query);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
};
