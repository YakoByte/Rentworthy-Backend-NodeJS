import { Express, Request, Response, NextFunction } from 'express';
import ProfileService from '../services/profile';
import UserAuth from '../middlewares/auth';
import upload from '../middlewares/imageStorage';
import { AuthenticatedRequest, getProfileRequest } from '../interface/profile';
// import { validateCreateAdmin } from './adminValidation';

export default (app: Express) => {
    const service = new ProfileService();
    // API = create new profile
    app.post('/create-profile', UserAuth, upload.single("image"), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        //validate admin from token
        // let admin = await (req);
        let authUser: any = req.user
        req.body.userId = authUser._id;
        req.body.profileImage = `http://localhost:4000/images/${req.file.filename}`;
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
            req.body.profileImage = `http://localhost:4000/images/${req.file.filename}`;
        }
        console.log("req.body", req.body)
        try {
            const { data } = await service.updateProfileById(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = delete profile by id
    app.post('/delete-profile', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
