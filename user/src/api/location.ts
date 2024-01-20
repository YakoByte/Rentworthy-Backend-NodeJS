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
        let authUser: any = req.user
        req.body.userId = authUser._id;
        console.log("req.body", req.body)
        try {
            const data = await service.CreateLocation(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = get location by id
    app.get('/get-location', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        let authUser: any = req.user
        req.body.userId = authUser._id;
        console.log("req.body", req.query)
        try {
            const data = await service.getLocationById(req.query);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = update location by id
    app.put('/update-location', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        let authUser: any = req.user
        req.body.userId = authUser._id;
        console.log("req.body", req.body)
        try {
            const data = await service.updateLocationById(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // // API = delete location by id
    app.delete('/delete-location', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        let authUser: any = req.user
        req.body.userId = authUser._id;

        console.log("req.body", req.body)
        try {
            const data = await service.deleteLocationById(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = count location coordinate
    app.get("/count-location", UserAuth, async(req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await service.countCordinate();
            return res.json(data);
        } catch (err) {
            next(err);
        }
    })

    app.get("/count-continent", UserAuth, async(req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await service.countContinentCoordinate();
            return res.json(data);
        } catch (err) {
            next(err);
        }
    })
};