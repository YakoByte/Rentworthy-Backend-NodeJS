import { Express, Request, Response, NextFunction } from 'express';
import AdminService from '../services/user';
import UserAuth from '../middlewares/auth';
import { AuthenticatedRequest, userSignRequest, userLoginRequest, socialUserLoginRequest } from '../interface/user';
// import { validateCreateAdmin, validateLoginUser } from './userValidation';
import RoleService from '../services/role';
import OTPService from '../services/otp';
// import { isAdmin } from '../middlewares/checkRole';

export default (app: Express) => {

  const adminService = new AdminService();
  const roleService = new RoleService();
  const otpService = new OTPService();

  // API = create new admin
  app.post('/admin/signup', async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("req.body", req.body)
      req.body.roleName = "admin";
      const { data } = await adminService.SignUp(req.body);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });
  // API = create new user
  app.post('/signup', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      console.log("req.body", req.body)
      req.body.roleName = "user";
      req.body.otp = req.user;
      const { data } = await adminService.SignUp(req.body);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  // API = login admin
  app.post('/admin/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userDetail: userLoginRequest = req.body;
      req.body.roleName = "admin";
      const { data } = await adminService.SignIn(userDetail);
      console.log("data", data)
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  // API = login user
  app.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userDetail: userLoginRequest = req.body;
      req.body.roleName = "user";
      const { data } = await adminService.SignIn(userDetail);
      console.log("data", data)
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  // API = create new otp
  app.post('/createOtp', async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body.ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      console.log("req.body", req.body)
      const { data } = await otpService.CreateNewOTP(req.body);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });
  // varify otp
  app.post('/verifyOtp', async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("req.body", req.body)
      const { data } = await otpService.VerifyOTP(req.body);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  })
  // API = reset password
  app.put('/reset-password', UserAuth, async (req: any, res: Response, next: NextFunction) => {
    try {
      console.log("req.body", req.body)
      // req.body._id = req.user._id;
      let bodyData: any = {
        _id: req.user._id,
        ...req.body
      }
      const { data } = await adminService.ResetPassword(bodyData);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  // API = sending password link
  // app.post('/send-password-link', async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     console.log("req.body", req.body)
  //     const { data } = await adminService.SendPasswordLink(req.body);
  //     return res.json(data);
  //   } catch (err) {
  //     next(err);
  //   }
  // });

  // API = social signUp
  app.post('/social-signup', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      console.log("req.body", req.body)
      req.body.roleName = "user";
      req.body.otp = req.user;
      const { data } = await adminService.SocialSignUp(req.body);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  // API = social logIn
  app.post('/social-login', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userDetail: socialUserLoginRequest = req.body;
      req.body.roleName = "user";
      const { data } = await adminService.SocialSignIn(userDetail);
      console.log("data", data)
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });
};
