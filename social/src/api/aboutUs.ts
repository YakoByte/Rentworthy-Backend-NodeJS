import { Express, Request, Response, NextFunction } from "express";
import AboutUSService from "../services/aboutUs";
import UserAuth from "../middlewares/auth";
import {
  AuthenticatedRequest,
  deleteAuthenticatedRequest,
} from "../interface/aboutUs";
import upload from "../middlewares/imageStorage";
import imageService from "../services/imageUpload";

export default (app: Express) => {
  const service = new AboutUSService();
  const image = new imageService();

  // API = create new AboutUS
  app.post("/create-aboutUS", UserAuth, upload.array("images", 10), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        let authUser: any = req.user;
        req.body.userId = authUser._id;

        if (req.files.length > 0) {    
          const imageData = {
              userId: authUser._id,
              imageDetails: req.files,
            }
  
            req.body.images = await image.CreateImages(imageData) as unknown as string[];;            
        }

        const data = await service.CreateAboutUS(req.body);
        return res.json(data);
      } catch (err) {
        console.log("api err", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  );

  // API = get AboutUS by id and search and all AboutUS
  app.get( "/get-aboutUS", UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const data = await service.getAboutUS(req.query);
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );

  // API = add images to AboutUS
  app.post("/add-images-to-aboutUS", UserAuth, upload.array("images", 10), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        let authUser: any = req.user;
        req.body.userId = authUser._id;

        if (req.files.length > 0) {    
          const imageData = {
              userId: authUser._id,
              imageDetails: req.files,
            }
  
            req.body.images = await image.CreateImages(imageData) as unknown as string[];;            
        }

        const data = await service.addImagesToAboutUS(req.body);
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );

  // API = update AboutUS by id
  app.put("/update-aboutUS", UserAuth, upload.array("images", 10), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        let authUser: any = req.user;
        req.body.userId = authUser._id;

        if (req.files.length > 0) {    
          const imageData = {
              userId: authUser._id,
              imageDetails: req.files,
            }
  
            req.body.images = await image.CreateImages(imageData) as unknown as string[];;            
        }

        const data = await service.updateAboutUSById(req.body);
        return res.json(data);
      } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  );

  //API = delete AboutUS
  app.delete( "/delete-aboutUS", UserAuth, async (req: deleteAuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        let authUser: any = req.user;
        req.body.userId = authUser._id;
        const data = await service.deleteAboutUS({
          _id: req.query._id as string,
        });
        return res.status(200).json(data);
      } catch (err) {
        return res.status(500).json({ error: "Internal Server Error", err });
      }
    }
  );
};
