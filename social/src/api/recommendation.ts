import { Express, Request, Response, NextFunction } from "express";
import RecommendationService from "../services/recommendation";
import UserAuth from "../middlewares/auth";
import { AuthenticatedRequest } from "../interface/recommendation";

export default (app: Express) => {
  const service = new RecommendationService();

  // API = create new ads
  app.post(
    "/create-recommendation",
    UserAuth,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        let authUser: any = req.user;
        req.body.userId = authUser._id;
        console.log("req.body", req.body);
        const data = await service.CreateRecommendation(req.body);
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );
};
