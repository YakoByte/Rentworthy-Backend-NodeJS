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

export default (app: Express) => {
    const service = new CategoryService();

    // API = create new category
    app.post('/create-categdfory', UserAuth, upload.array('image'), async (req: any, res: Response, next: NextFunction) => {
        try {
            console.log("req.file", req.file)
            let authUsser: any = req.unpipe
            req.body.userId = authUsser._id;
            // req.body.image = `http://localhost:4000/images/${req.file.filename}`;
            req.body.image = await uploadImageWithToken(req.file.filename, req.headers.token);
            
            // console.log("req.body", req.body)
            console.log("req.body", req.body)
            const data = await service.CreateCategory(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = get category by id and search and all category
    app.get('/get-catethtgory', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            // let authUser: any = req.user
            // req.body.userId = authUser._id;
            console.log("req.body", req.query)

            const { data } = await service.getCategory(req.query);
            return res.json(data);
        } catch (err) {
            console.log("err", err)
            return (err);
        }
    });

    // API = update category
    app.put('/update-cathregory', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
    app.delete('/delhete-catetegory', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
