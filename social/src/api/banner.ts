import { Express, Request, Response, NextFunction } from "express";
import BannerService from "../services/banner";
import UserAuth from "../middlewares/auth";
import {
  AuthenticatedRequest,
  deleteAuthenticatedRequest,
} from "../interface/banner";
import upload from "../middlewares/imageStorage";
import imageService from "../services/imageUpload";

export default (app: Express) => {
  const service = new BannerService();
  const image = new imageService();

  // API = create new Banner
  app.post("/create-banner", UserAuth, upload.array("images", 10), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        let authUser: any = req.user;
        req.body.userId = authUser._id;

        // Check if req.file is defined before accessing its properties
        if (req.files.length > 0) {    
          const imageData = {
              userId: authUser._id,
              imageDetails: req.files,
            }
  
            req.body.images = await image.CreateImages(imageData) as unknown as string[];;            
        }

        const data = await service.CreateBanner(req.body);
        return res.json(data);
      } catch (err) {
        console.log("api err", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  );

  // API = get Banner by id and search and all Banner
  app.get( "/get-banner", UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const data = await service.getBanner(req.query);
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );

  // API = add images to Banner
  app.post("/add-images-to-banner", UserAuth, upload.array("images", 10), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

        const data = await service.addImagesToBanner(req.body);
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );

  // API = update Banner by id
  app.put("/update-banner", UserAuth, upload.array("images", 10), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

        const data = await service.updateBannerById(req.body);
        return res.json(data);
      } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  );

  //API = delete Banner
  app.delete( "/delete-banner", UserAuth, async (req: deleteAuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        let authUser: any = req.user;
        req.body.userId = authUser._id;
        const data = await service.deleteBanner({
          _id: req.query._id as string,
        });
        return res.status(200).json(data);
      } catch (err) {
        return res.status(500).json({ error: "Internal Server Error", err });
      }
    }
  );
};
