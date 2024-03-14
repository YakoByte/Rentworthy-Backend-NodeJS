import { Express, Request, Response, NextFunction } from 'express';
import AdminService from '../services/user';
import UserAuth from '../middlewares/auth';
import { AuthenticatedRequest, userLoginRequest, socialUserLoginRequest, getCountAuthenticatedRequest } from '../interface/user';
import OTPService from '../services/otp';
import { validateEmail, validateNumber, validatePassword } from '../middlewares/vaildateInput';
import { loggerFunction } from '../utils/logger';
import { isAdmin } from '../middlewares/checkRole';

export default (app: Express) => {

  const adminService = new AdminService();
  const otpService = new OTPService();

  // API = create new admin
  app.post('/admin/signup', validateEmail, validateNumber, validatePassword, async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body.roleName = "admin";
      const data = await adminService.SignUp(req.body);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  // API = create new user
  app.post('/signup', validateEmail, validateNumber, validatePassword, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      req.body.roleName = "user";
      const data = await adminService.SignUp(req.body);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  // API = login admin
  app.post('/admin/login', async (req: any, res: Response, next: NextFunction) => {
    try {
      console.log(req.clientPlatform);
      req.body.os = req.clientPlatform;
      const userDetail = req.body;
      req.body.roleName = "admin";
      const data = await adminService.SignIn(userDetail);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  // API = login user
  app.post('/login', loggerFunction, async (req: any, res: Response, next: NextFunction) => {
    try {
      req.body.os = req.clientPlatform;
      const userDetail: userLoginRequest = req.body;
      req.body.roleName = "user";
      const data = await adminService.SignIn(userDetail);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  // create otp
  app.post('/createOtp', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await otpService.CreateNewOTP(req.body);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  // varify otp
  app.post('/verifyotp', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await otpService.VerifyOTP(req.body);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  })

  // API = Check if the token has expired
  app.post('/verify-token-expiry', UserAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token: any = req.headers.authorization
      const data = await adminService.expiryToken(token);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  })

  // API = reset password
  app.put('/reset-password', UserAuth, async (req: any, res: Response, next: NextFunction) => {
    try {
      let bodyData: any = {
        _id: req.user._id,
        ...req.body
      }
      const data = await adminService.ResetPassword(bodyData);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  // API = social signUp
  app.post('/social-signup', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      req.body.roleName = "user";
      const data = await adminService.SocialSignUp(req.body);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  // API = social logIn
  app.post('/social-login', async (req: any, res: Response, next: NextFunction) => {
    try {
      const userDetail: socialUserLoginRequest = req.body;
      req.body.roleName = "user";
      req.body.os = req.clientPlatform;
      const data = await adminService.SocialSignIn(userDetail);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  // API = social logIn
  app.post('/block-user',UserAuth, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.BlockedUser(req.body.userId);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post('/unblock-user',UserAuth, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.UnBlockUser(req.body.userId);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get('/get-all-users', UserAuth, isAdmin, async (req: any, res: Response, next: NextFunction) => {
    try {
      const clientPlatform = req.clientPlatform;
      const data = await adminService.GetAllUsers();
      console.log("data", data)
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  // api = get Windows, Android, iOS, Linux, Other counts
  app.get('/get-count', UserAuth, isAdmin, async (req: any, res: Response, next: NextFunction) => {
    try {
      const clientPlatform = req.clientPlatform;
      const data = await adminService.GetCount();
      console.log("data", data)
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  //API = count visitor by every minutes   
  app.get('/get-visitor/statiscs', UserAuth, async (req: getCountAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      let authUser: any = req.user
      let criteria = req.query.criteria
      const data = await adminService.getCountOfPayment(criteria);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });
};
