import { Express, Request, Response, NextFunction } from "express";
import SubscriptionService from "../services/subscription";
import UserAuth from "../middlewares/auth";
import { isAdmin } from "../middlewares/checkRole";
import {
  AuthenticatedRequest,
  deleteAuthenticatedRequest,
} from "../interface/subscription";

export default (app: Express) => {
  const service = new SubscriptionService();

  // API = create new subscription
  app.post(
    "/create-subscription",
    UserAuth,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        let authUser: any = req.user;
        req.body.userId = authUser._id;

        console.log("req.body", req.body);

        const data = await service.CreateSubscription(req.body);
        return res.json(data);
      } catch (err) {
        console.log("api err", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  );
  // API = get subscription by id and search and all subscription
  app.get(
    "/get-subscription",
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        // let authUser = req.user as { _id: string; roleName: string; email: string; };
        // req.query.user = authUser;
        console.log("req.query", req.query);
        // console.log("authUser", authUser)
        const data = await service.getSubscription(req.query);
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );

  // API = update subscription by id
  app.put(
    "/update-subscription",
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
  //API = delete subscription
  app.delete(
    "/delete-subscription",
    UserAuth,
    async (
      req: deleteAuthenticatedRequest,
      res: Response,
      next: NextFunction
    ) => {
      try {
        let authUser: any = req.user;
        req.body.userId = authUser._id;
        const data = await service.deleteSubscription(req.query);
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );
};
