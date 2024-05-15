import { Express, Request, Response, NextFunction } from 'express';
import ProfileService from '../services/profile';
import imageService from '../services/imageUpload';
import UserAuth from '../middlewares/auth';
import upload from '../middlewares/imageStorage';
import { AuthenticatedRequest, getProfileRequest } from '../interface/profile';
import { isAdmin } from '../middlewares/checkRole';
    
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

        try {
            let data
            if (authUser.roleName === "admin") {
                data = await service.getAllProfile(body);
            }
            else if (req.query.userId) {
                req.body.userId = req.query.userId;
                await service.updateUserView(req.body.userId);
                data = await service.getProfileByUserId(req.body);
            } else {
                req.body.userId = authUser._id
                data = await service.getProfileByUserId(req.body);
            }
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = get profile by id
    app.get('/get-profile-admin', UserAuth, isAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            if(!req.query.userId) {
                return res.json({message: "userId is required!"})
            }

            req.body = {...req.query}

            await service.updateUserView(req.body.userId);
            let data = await service.getProfileByUserId(req.body);
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