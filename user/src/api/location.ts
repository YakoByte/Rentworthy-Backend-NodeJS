import { Express, Request, Response, NextFunction } from 'express';
import LocationService from '../services/location';
import UserAuth from '../middlewares/auth';
// import upload from '../middlewares/imageStorage';
import { AuthenticatedRequest } from '../interface/location';
import { isAdmin } from '../middlewares/checkRole';
// import { validateCreateAdmin } from './adminValidation';

export default (app: Express) => {
    const service = new LocationService();
    // API = create new location
    app.post('/create-location', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        //validate admin from token
        // let admin = await (req);
        let authUser: any = req.user
        req.body.userId = authUser._id;
        // req.body.image = `http://localhost:4000/images/${req.file.filename}`;
        console.log("req.body", req.body)
        try {
            const { data } = await service.CreateLocation(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = get location by id
    app.get('/get-location', UserAuth, isAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        //validate admin from token
        // let admin = await (req);
        // req.body._id = req.query._id
        console.log("req.body", req.query)
        try {
            const data = await service.getLocationById(req.query);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = update location by id
    // app.put('/update-location', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    //     //validate admin from token
    //     // let admin = await (req);
    //     let authUser: any = req.user
    //     req.body.userId = authUser._id;
    //     if (req.file) {
    //         req.body.image = `http://localhost:4000/images/${req.file.filename}`;
    //     }
    //     console.log("req.body", req.body)
    //     try {
    //         const { data } = await service.updateLocationById(req.body);
    //         return res.json(data);
    //     } catch (err) {
    //         next(err);
    //     }
    // });

    // // API = delete location by id
    // app.delete('/delete-location', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    //     //validate admin from token
    //     // let admin = await (req);
    //     let authUser: any = req.user
    //     req.body.userId = authUser._id;

    //     console.log("req.body", req.body)
    //     try {
    //         const { data } = await service.deleteLocationById(req.body);
    //         return res.json(data);
    //     } catch (err) {
    //         next(err);
    //     }
    // });

};