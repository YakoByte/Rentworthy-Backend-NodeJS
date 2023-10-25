import { Express, Request, Response, NextFunction } from 'express';
import RoleService from '../services/role';
import UserAuth from '../middlewares/auth';
// import { AuthenticatedRequest, userSignRequest } from '../interface/admin';
// import { validateCreateAdmin } from './adminValidation';

export default (app: Express) => {
    const service = new RoleService();
    // API = create new role
    app.post('/role/createRole', UserAuth, async (req: Request, res: Response, next: NextFunction) => {
        //validate admin from token
        // let admin = await (req);
        console.log("req.body", req.body)
        try {
            const { data } = await service.CreateRole(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
};
