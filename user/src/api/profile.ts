import { Express, Request, Response, NextFunction } from 'express';
import ProfileService from '../services/profile';
import UserAuth from '../middlewares/auth';
import upload from '../middlewares/imageStorage';
import { AuthenticatedRequest, getProfileRequest } from '../interface/profile';
// import { validateCreateAdmin } from './adminValidation';
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

async function uploadImageWithToken(imagePath: string, token: string): Promise<string> {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));

    try {
        const response = await axios.post("http://localhost:5003/image-upload", formData, {
            headers: {
                ...formData.getHeaders(),
                Authorization: token,
            },
        });

        console.log(response.data.data.existingImage._id);
        

        return response.data.data.existingImage._id; // Assuming you are expecting a single image ID
    } catch (error: any) {
        return error.message;
    }
}
    
export default (app: Express) => {
    const service = new ProfileService();
    // API = create new profile
    app.post('/create-profile', UserAuth, upload.single("image"), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        let authUser: any = req.user
        req.body.userId = authUser._id;
        console.log("req.file", req.file)
        if (req.file) {
            req.body.profileImage = await uploadImageWithToken(req.file.path, req.headers.authorization);
        }
        console.log("req.body", req.body)
        try {
            const { data } = await service.CreateProfile(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = get profile by id
    app.get('/get-profile', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        //validate admin from token
        // let admin = await (req);
        let body: getProfileRequest = req.query
        let authUser: any = req.user
        req.body.userId = authUser._id
        console.log("req.body", req.body)
        try {
            let data
            if (authUser.roleName === "admin") {
                console.log("admin")
                data = await service.getAllProfile(body);
            }
            else {
                data = await service.getProfileById(req.body);
            }
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = update profile by id
    app.put('/update-profile', UserAuth, upload.single("image"), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        //validate admin from token
        // let admin = await (req);
        let authUser: any = req.user
        req.body.userId = authUser._id;
        if (req.file) {
            req.body.profileImage = await uploadImageWithToken(req.file.path, req.headers.authorization);
        }
        console.log("req.body", req.body)
        try {
            const { data } = await service.updateProfileById(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });


    app.put('/update-level', async (req: Request, res: Response, next: NextFunction) => {
        console.log("req.body", req.body)
        try {
            const { data } = await service.updateLevel(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    })
    

    // API = delete profile by id
    app.delete('/delete-profile', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        //validate admin from token
        // let admin = await (req);
        let authUser: any = req.user
        req.body.userId = authUser._id;

        console.log("req.body", req.body)
        try {
            const { data } = await service.deleteProfileById(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

};
