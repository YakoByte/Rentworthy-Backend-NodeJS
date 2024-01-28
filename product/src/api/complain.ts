import { Express, Request, Response, NextFunction } from 'express';
import ComplainService from '../services/complain';
import UserAuth from '../middlewares/auth';
import { AuthenticatedRequest } from '../interface/complain';
import upload from '../middlewares/imageStorage';
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

async function uploadMultipleImagesWithToken(imagePaths: string[], token: string): Promise<string[]> {
    const formData = new FormData();

    for (const imagePath of imagePaths) {
        formData.append('image', fs.createReadStream(imagePath));
    }

    try {
        const response = await axios.post("https://backend.rentworthy.us/web/api/v1/upload/image-uploads", formData, {
            headers: {
                ...formData.getHeaders(),
                Authorization: token,
            },
        });
    
        const paths: string[] = response.data.map((element: any) => element._id);

        imagePaths.forEach(async (element: any) => {
            if (fs.existsSync(element)) {
              fs.unlinkSync(element);
            }
        });

        return paths;
    } catch (error: any) {
        imagePaths.forEach(async (element: any) => {
            if (fs.existsSync(element)) {
              fs.unlinkSync(element);
            }
        });
        return [error.message];
    }
}

export default (app: Express) => {
    const service = new ComplainService();


    // API = create new Complain
    app.post('/create-complain', UserAuth, upload.array('images', 10), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
            console.log(req.body.images);
            
            const data = await service.CreateComplain(req.body);
            return res.status(200).json(data);
        } catch (err: any) {
            console.log('went like this-----', err)
            return res.status(err.STATUS_CODE).json(err);
        }
    });

    // // API = get Complain by id and search and all Complain
    app.get('/get-complain', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const data = await service.getComplain({ ...req.query});
            return res.status(200).json(data);
        } catch (err: any) {
            console.log('went in',err)
            return res.status(500).json(err);
        }
    });

    // // API = update Complain
    app.put('/update-complain', UserAuth, upload.array('images', 10), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;

            if (req.files.length > 0) {                
                req.body.images = await uploadMultipleImagesWithToken(req.files.map((obj: { path: any; }) => obj.path), req.headers.authorization);
            }
            console.log(req.body);

            req.body = { ...req.body }
            let coordinate = JSON.parse(req.body['location.coordinates'])
            delete req.body['location.coordinates']
            req.body.location = {
                type: "Point",
                coordinates: coordinate
            }
            
            const data = await service.updateComplain({ ...req.body, userId: req.user._id, _id: req.query._id });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // // API = delete Complain
    app.delete('/delete-complain', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user
            req.body.userId = authUser._id;
            console.log("req.body", req.query)
            const data = await service.deleteComplain(req.query);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
};