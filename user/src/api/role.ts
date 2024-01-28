import { Express, Request, Response, NextFunction } from 'express';
import RoleService from '../services/role';
import UserAuth from '../middlewares/auth';

export default (app: Express) => {
    const service = new RoleService();
    // API = create new role
    app.post('/role/createRole', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await service.CreateRole(req.body);
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
};
