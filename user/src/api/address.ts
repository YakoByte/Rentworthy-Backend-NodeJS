import { Express, Request, Response, NextFunction } from 'express';
import AddressService from '../services/address';
import UserAuth from '../middlewares/auth';
import upload from '../middlewares/imageStorage';
import { AuthenticatedRequest } from '../interface/address';
// import { validateCreateAdmin } from './adminValidation';

export default (app: Express) => {
    const service = new AddressService();
    // API = create new address
    app.post('/create-address', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        //validate admin from token
        // let admin = await (req);
        let authUser: any = req.user
        req.body.userId = authUser._id;
        // req.body.image = `http://localhost:4000/images/${req.file.filename}`;
        console.log("req.body", req.body)
        try {
            const data = await service.CreateAddress(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = get address by id
    app.get('/get-address', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        //validate admin from token
        // let admin = await (req);
        // req.body._id = req.query._id
        let authUser: any = req.user
        req.body.userId = authUser._id;
        console.log("req.body", req.query)
        try {
            const data = await service.getAddressById(req.query);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = update address by id
    app.put('/update-address', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        //validate admin from token
        // let admin = await (req);
        let authUser: any = req.user
        req.body._id = req.query._id
        req.body.userId = authUser._id;
        console.log("req.body", req.body)
        try {
            const data = await service.updateAddressById(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    // API = delete address by id
    app.delete('/delete-address', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        //validate admin from token
        // let admin = await (req);
        let authUser: any = req.user
        req.body.userId = authUser._id;
        req.body._id = req.query._id

        console.log("req.body", req.body)
        try {
            const data = await service.deleteAddressById(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

};
