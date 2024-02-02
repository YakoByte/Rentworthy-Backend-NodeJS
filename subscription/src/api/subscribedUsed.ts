import { Express, Request, Response, NextFunction } from "express";
import SubscribedUserService from "../services/subscribedUser";
import UserAuth from "../middlewares/auth";
import {
  AuthenticatedRequest,
  deleteAuthenticatedRequest,
} from "../interface/subscribedUser";

export default (app: Express) => {
  const service = new SubscribedUserService();

  // API = create new SubscribedUser
  app.post(
    "/create-SubscribedUser",
    UserAuth,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        let authUser: any = req.user;
        req.body.userId = authUser._id;

        const data = await service.CreateSubscribedUser(req.body);
        return res.json(data);
      } catch (err) {
        console.log("api err", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  );

  // API = get SubscribedUser by id and search and all SubscribedUser
  app.get(
    "/get-SubscribedUser",
    UserAuth,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const data = await service.getSubscribedUser(req.query);
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );

  app.get(
    "/get-SubscribedUser/userId",
    UserAuth,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        let authUser: any = req.user;
        req.query.userId = authUser._id;

        const data = await service.getSubscribedUser(req.query);
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );

  // API = update SubscribedUser by id
  app.put(
    "/update-SubscribedUser",
    UserAuth,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        let authUser: any = req.user;
        req.body.userId = authUser._id;

        const data = await service.updateById({
          ...req.body,
          _id: req.query._id as string,
        });
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );

  //API = delete SubscribedUser
  app.delete(
    "/delete-SubscribedUser",
    UserAuth,
    async (req: deleteAuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        let authUser: any = req.user;
        req.body.userId = authUser._id;
        const data = await service.deleteSubscribedUser(req.query);
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );
};
