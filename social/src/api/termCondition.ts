
import { Express, Request, Response, NextFunction } from 'express';
import TermConditionService from '../services/termCondition';
import UserAuth from '../middlewares/auth';
import { isAdmin } from '../middlewares/checkRole';
import { AuthenticatedRequest, deleteAuthenticatedRequest } from '../interface/termCondition';
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
    const service = new TermConditionService();

    // API = create new termCondition
    app.post('/create-termCondition', UserAuth, upload.single("image"), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
    
            const data = await service.CreateTermCondition(req.body);
            return res.json(data);
        } catch (err) {
            console.log("api err", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    });    
    // API = get termCondition by id and search and all termCondition
    app.get('/get-termCondition', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser = req.user as { _id: string; roleName: string; email: string; };
            // req.query.user = authUser;
            console.log("req.query", req.query)
            console.log("authUser", authUser)
            const { data } = await service.getTermConditionById({ ...req.query, user: authUser });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
    // API = get termCondition by id and search and all termCondition
    app.get('/get-termCondition/title', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser = req.user as { _id: string; roleName: string; email: string; };
            // req.query.user = authUser;
            console.log("req.query", req.query)
            console.log("authUser", authUser)
            const { data } = await service.getTermCondition({ ...req.query, user: authUser });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
    // API = get termCondition by id and search and all termCondition
    app.get('/get-termCondition/all', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser = req.user as { _id: string; roleName: string; email: string; };
            // req.query.user = authUser;
            console.log("req.query", req.query)
            console.log("authUser", authUser)
            const { data } = await service.getAllTermCondition({ ...req.query, user: authUser });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
    // API = add images to termCondition
    app.post('/add-images-to-termCondition', UserAuth, upload.single("image"), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user;
            req.body.userId = authUser._id;

            const existingData = await service.getTermConditionById({ ...req.body, user: authUser });
            const imageId = existingData.data.existingtermCondition.data.image 
            
            if(imageId){
                req.body.image = await deleteImageWithToken(imageId, req.headers.authorization);
            }
   
            if (req.file) {
                req.body.image = await uploadImageWithToken(req.file.path, req.headers.authorization);
            }

            const data = await service.addImagesToTermCondition(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
    // API = update termCondition by id
    app.put('/update-termCondition', UserAuth, upload.single("image"), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user;
            req.body.userId = authUser._id;

            const existingData = await service.getTermConditionById({ ...req.body, user: authUser });
            const imageId = existingData.data.existingtermCondition.data.image 
            
            if(imageId){
                req.body.image = await deleteImageWithToken(imageId, req.headers.authorization);
            }
   
            if (req.file) {
                req.body.image = await uploadImageWithToken(req.file.path, req.headers.authorization);
            }

            const data = await service.updateById({...req.body, _id: req.body._id as string});
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
    //API = delete termCondition
    app.delete('/delete-termCondition', UserAuth, async (req: deleteAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            let authUser: any = req.user;
            req.body.userId = authUser._id;

            const existingData = await service.getTermConditionById({ ...req.body, user: authUser });
            const imageId = existingData.data.existingtermCondition.data.image 
            
            if(imageId){
                req.body.image = await deleteImageWithToken(imageId, req.headers.authorization);
            }
            const data = await service.deleteTermCondition({ ...req.body });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
};
