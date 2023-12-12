
import { Express, Request, Response, NextFunction } from 'express';
import PrivacyPolicyService from '../services/privacyPolicy';
import UserAuth from '../middlewares/auth';
import { isAdmin } from '../middlewares/checkRole';
import { AuthenticatedRequest, deleteAuthenticatedRequest } from '../interface/privacyPolicy';
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

    try {
        const response = await axios.post("http://localhost:5000/app/api/v1/upload/image-uploads", formData, {
            headers: {
                ...formData.getHeaders(),
                Authorization: token,
            },
        });
        return response.data.existingImage[0]._id; // Assuming you are expecting a single image ID
    } catch (error: any) {
        return error.message;
    }
}

export default (app: Express) => {
    const service = new PrivacyPolicyService();

    // API = create new PrivacyPolicy
    app.post('/create-privacyPolicy', UserAuth, upload.single("image"), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user;
            req.body.userId = authUser._id;
            
            console.log("req.body", req.body);
    
            // Check if req.file is defined before accessing its properties
            if (req.file) {
                req.body.image = await uploadImageWithToken(req.file.path, req.headers.authorization);
            } else {
                throw new Error("No file provided");
            }
    
            const data = await service.CreatePrivacyPolicy(req.body);
            return res.json(data);
        } catch (err) {
            console.log("api err", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    });    
    // API = get PrivacyPolicy by id and search and all PrivacyPolicy
    app.get('/get-privacyPolicy', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser = req.user as { _id: string; roleName: string; email: string; };
            // req.query.user = authUser;
            console.log("req.query", req.query)
            console.log("authUser", authUser)
            const { data } = await service.getPrivacyPolicyById({ ...req.query, user: authUser });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
    // API = get PrivacyPolicy by id and search and all PrivacyPolicy
    app.get('/get-privacyPolicy/title', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser = req.user as { _id: string; roleName: string; email: string; };
            // req.query.user = authUser;
            console.log("req.query", req.query)
            console.log("authUser", authUser)
            const { data } = await service.getPrivacyPolicy({ ...req.query, user: authUser });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
    // API = get PrivacyPolicy by id and search and all PrivacyPolicy
    app.get('/get-privacyPolicy/all', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser = req.user as { _id: string; roleName: string; email: string; };
            // req.query.user = authUser;
            console.log("req.query", req.query)
            console.log("authUser", authUser)
            const { data } = await service.getAllPrivacyPolicy({ ...req.query, user: authUser });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
    // API = add images to PrivacyPolicy
    app.post('/add-images-to-privacyPolicy', UserAuth, upload.array("images", 10), async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await service.addImagesToPrivacyPolicy(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
    // API = update PrivacyPolicy by id
    app.put('/update-privacyPolicy-by-id', UserAuth, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await service.updateById({...req.body, _id: req.query._id as string});
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
    //API = delete PrivacyPolicy
    app.delete('/delete-privacyPolicy', UserAuth, async (req: deleteAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const data = await service.deletePrivacyPolicy({ ...req.query });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

};
