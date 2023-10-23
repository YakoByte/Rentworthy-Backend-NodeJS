import { Express, Request, Response, NextFunction } from 'express';
import AdminService from '../services/admin';
import UserAuth from '../middlewares/auth';
import { AuthenticatedRequest, userRequest } from '../interface/admin';
import { validateCreateAdmin } from './adminValidation';

export default (app: Express) => {
  const service = new AdminService();

  app.post('/admin/signup', validateCreateAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data } = await service.SignUp(req.body);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post('/admin/create-user', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: userRequest = req.body;
      const { data } = await service.SignUp(user);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post('/admin/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const { data } = await service.SignIn({ email, password });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  // app.post('/admin/address', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  //   try {
  //     const { _id } = req.user!;
  //     const userId = _id;
  //     const { address1, address2, city, state, postalCode, country } = req.body;
  //     const { data } = await service.AddNewAddress({
  //       userId,
  //       address1,
  //       address2,
  //       city,
  //       state,
  //       postalCode,
  //       country,
  //     });
  //     return res.json(data);
  //   } catch (err) {
  //     next(err);
  //   }
  // });

  app.get('/admin/profile', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.user!;
      const { data } = await service.GetProfile(_id as string);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });
  app.get('/admin', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      return res.json({
        data: "Admin is Working"
      });
    } catch (err) {
      next(err);
    }
  });
};
