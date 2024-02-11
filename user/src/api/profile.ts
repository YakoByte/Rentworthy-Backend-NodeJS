import { Express, Request, Response, NextFunction } from 'express';
import ProfileService from '../services/profile';
import imageService from '../services/imageUpload';
import UserAuth from '../middlewares/auth';
import upload from '../middlewares/imageStorage';
import { AuthenticatedRequest, getProfileRequest } from '../interface/profile';
// import axios from 'axios';
// import fs from 'fs';
// import FormData from 'form-data';

// async function uploadImageWithToken(imagePath: string, token: string): Promise<string> {
//     const formData = new FormData();
//     formData.append('image', fs.createReadStream(imagePath));

//     try {
//         const response = await axios.post("https://backend.rentworthy.us/web/api/v1/upload/image-uploads", formData, {
//             headers: {
//                 ...formData.getHeaders(),
//                 Authorization: token,
//             },
//         });

//         if (fs.existsSync(imagePath)) {
//             fs.unlinkSync(imagePath);
//           }

//         return response.data._id;
//     } catch (error: any) {
//         if (fs.existsSync(imagePath)) {
//             fs.unlinkSync(imagePath);
//           }
//         return error.message;
//     }
// }
    
export default (app: Express) => {
    const service = new ProfileService();
    const image = new imageService();

    // API = create new profile
    app.post('/create-profile', UserAuth, upload.single("image"), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        let authUser: any = req.user
        req.body.userId = authUser._id;

        if (req.file) {
            const imageData = {
               userId: authUser._id,
               imageDetail: req.file,
            }
            req.body.profileImage = await image.CreateImage(imageData);
        }

        try {
            const data = await service.CreateProfile(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = get profile by id
    app.get('/get-profile', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        let body: getProfileRequest = req.query
        let authUser: any = req.user
        req.body.userId = authUser._id

        try {
            let data
            if (authUser.roleName === "admin") {
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
        let authUser: any = req.user
        req.body.userId = authUser._id;
        if (req.file) {
            const imageData = {
                userId: authUser._id,
                imageDetail: req.file,
             }
             req.body.profileImage = await image.CreateImage(imageData);
        }
        try {
            const data = await service.updateProfileById(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.put('/update-level', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await service.updateLevel(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    })   

    // API = delete profile by id
    app.delete('/delete-profile', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        let authUser: any = req.user
        req.body.userId = authUser._id;
        try {
            const data = await service.deleteProfileById(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
};