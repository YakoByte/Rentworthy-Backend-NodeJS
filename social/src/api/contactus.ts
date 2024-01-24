import { Express, Request, Response, NextFunction } from "express";
import ContactUsService from "../services/contactus";
import UserAuth from "../middlewares/auth";

export default (app: Express) => {
  const service = new ContactUsService();

  // API = create new contact us
  app.post(
    "/create-contactus",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        console.log("req.body", req.body);
        const data = await service.createContactUs(req.body);
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );
};
