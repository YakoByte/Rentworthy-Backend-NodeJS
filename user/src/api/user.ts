import { Express, Request, Response, NextFunction } from 'express';
import AdminService from '../services/user';
import UserAuth from '../middlewares/auth';
import { AuthenticatedRequest, userSignRequest, userLoginRequest, socialUserLoginRequest, getCountAuthenticatedRequest } from '../interface/user';
import RoleService from '../services/role';
import OTPService from '../services/otp';

export default (app: Express) => {

  const adminService = new AdminService();
  const roleService = new RoleService();
  const otpService = new OTPService();

  // API = create new admin
  app.post('/admin/signup', async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("req.body", req.body)
      req.body.roleName = "admin";
      const data = await adminService.SignUp(req.body);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  // API = create new user
  app.post('/signup', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      console.log("req.body", req.body)
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
      console.log("data", data)
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  // API = login user
  app.post('/login', async (req: any, res: Response, next: NextFunction) => {
    try {
      req.body.os = req.clientPlatform;
      const userDetail: userLoginRequest = req.body;
      req.body.roleName = "user";
      const data = await adminService.SignIn(userDetail);
      console.log("data", data)
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  // create otp
  app.post('/createOtp', async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("req.body", req.body)
      const data = await otpService.CreateNewOTP(req.body);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  // varify otp
  app.post('/verifyotp', async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("req.body", req.body)
      const data = await otpService.VerifyOTP(req.body);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  })

  // API = Check if the token has expired
  app.post('/verifytokenexpiry', UserAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("req.body", req.body)
      let token: any = req.headers.authorization
      const data = await adminService.expiryToken(token);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  })

  // API = reset password
  app.put('/resetpassword', UserAuth, async (req: any, res: Response, next: NextFunction) => {
    try {
      console.log("req.body", req.body)
      // req.body._id = req.user._id;
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

  // API = social logIn
  app.post('/sociallogin', async (req: any, res: Response, next: NextFunction) => {
    try {
      const userDetail: socialUserLoginRequest = req.body;
      req.body.roleName = "user";
      req.body.os = req.clientPlatform;
      const data = await adminService.SocialSignIn(userDetail);
      console.log("data", data)
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get('/getallusers', async (req: any, res: Response, next: NextFunction) => {
    try {
      const clientPlatform = req.clientPlatform;
      console.log("clientPlatform", clientPlatform)
      // const userDetail: socialUserLoginRequest = req.body;
      // req.body.roleName = "user";
      const data = await adminService.GetAllUsers();
      console.log("data", data)
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  // api = get Windows, Android, iOS, Linux, Other counts
  app.get('/getcount', async (req: any, res: Response, next: NextFunction) => {
    try {
      const clientPlatform = req.clientPlatform;
      console.log("clientPlatform", clientPlatform)
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
