
import { Express, Request, Response, NextFunction } from 'express';
import AboutUSService from '../services/aboutUs';
import UserAuth from '../middlewares/auth';
import { isAdmin } from '../middlewares/checkRole';
import { AuthenticatedRequest, deleteAuthenticatedRequest } from '../interface/aboutUs';
import upload from '../middlewares/imageStorage';
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
// import multer from 'multer';
// import path from 'path';
// import { validateCreateAdmin } from './adminValidation';

async function uploadImageWithToken(imagePath: string, token: string): Promise<string> {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));
    console.log("formData", imagePath)
    try {
        const response = await axios.post("http://localhost:5000/app/api/v1/upload/image-upload", formData, {
            headers: {
                ...formData.getHeaders(),
                Authorization: token,
            },
        });
        console.log("response", response)
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
    const service = new AboutUSService();

    // API = create new AboutUS
    app.post('/create-aboutUS', UserAuth, upload.single("image"), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user;
            req.body.userId = authUser._id;
            // console.log("req.")
            console.log("req.body", req.file);

            // Check if req.file is defined before accessing its properties
            if (req.file) {
                req.body.image = await uploadImageWithToken(req.file.path, req.headers.authorization);
                console.log("req.body.image", req.body.image);
            } else {
                throw new Error("No file provided");
            }

            const data = await service.CreateAboutUS(req.body);
            return res.json(data);
        } catch (err) {
            console.log("api err", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    });
    // API = get AboutUS by id and search and all AboutUS
    app.get('/get-aboutUS', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser = req.user as { _id: string; roleName: string; email: string; };
            // req.query.user = authUser;
            console.log("req.query", req.query)
            // console.log("authUser", authUser)
            const { data } = await service.getAboutUS(req.query);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
    // API = get AboutUS by id and search and all AboutUS
    app.get('/get-aboutUS/title', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser = req.user as { _id: string; roleName: string; email: string; };
            // req.query.user = authUser;
            console.log("req.query", req.query)
            console.log("authUser", authUser)
            const { data } = await service.getAboutUS(req.query);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
    // API = get AboutUS by id and search and all AboutUS
    app.get('/get-aboutUS/all', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser = req.user as { _id: string; roleName: string; email: string; };
            // req.query.user = authUser;
            console.log("req.query", req.query)
            console.log("authUser", authUser)
            const { data } = await service.getAboutUS(req.query);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
    // API = add images to AboutUS
    app.post('/add-images-to-aboutUS', UserAuth, upload.single("image"), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user;
            req.body.userId = authUser._id;

            const existingData = await service.getAboutUS({ ...req.body, user: authUser });
            const imageId = existingData.data.existingAboutUS.data.image

            if (imageId) {
                req.body.image = await deleteImageWithToken(imageId, req.headers.authorization);
            }

            if (req.file) {
                req.body.image = await uploadImageWithToken(req.file.path, req.headers.authorization);
            }

            const data = await service.addImagesToAboutUS(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
    // API = update AboutUS by id
    app.put('/update-aboutUS', UserAuth, upload.single("image"), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user;
            req.body.userId = authUser._id;

            const existingData = await service.getAboutUS({ ...req.body, user: authUser });
            const imageId = existingData.data.existingAboutUS.data.image

            if (imageId) {
                req.body.image = await deleteImageWithToken(imageId, req.headers.authorization);
            }

            if (req.file) {
                req.body.image = await uploadImageWithToken(req.file.path, req.headers.authorization);
            }

            const data = await service.updateById({ ...req.body, _id: req.query._id as string });
            return res.json(data);
        } catch (err) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    });
    //API = delete AboutUS
    app.delete('/delete-aboutUS', UserAuth, async (req: deleteAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user;
            // req.body.userId = authUser._id;

            const existingData = await service.getAboutUS(req.query);
            const imageId = existingData.data.existingAboutUS.data.image

            if (imageId) {
                req.body.image = await deleteImageWithToken(imageId, req.headers.authorization);
            }
            const data = await service.deleteAboutUS({ _id: req.query._id as string });
            return res.status(200).json(data);
        } catch (err) {
           return res.status(500).json({ error: "Internal Server Error", err });
        }
    });
};
