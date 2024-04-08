import { Express, Request, Response, NextFunction } from "express";
import adminADSService from "../services/adminADS";
import UserAuth from "../middlewares/auth";
import {
  AuthenticatedRequest,
  deleteAuthenticatedRequest,
} from "../interface/adminADS";
import upload from "../middlewares/imageStorage";
import imageService from "../services/imageUpload";

export default (app: Express) => {
  const service = new adminADSService();
  const image = new imageService();

  // API = create new adminADS
  app.post("/create-admin-ads", UserAuth, upload.array("images", 10), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

        const data = await service.CreateAdminADS(req.body);
        return res.json(data);
      } catch (err) {
        console.log("api err", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  );

  // API = get adminADS by id and search and all adminADS
  app.get( "/get-admin-ads", UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const data = await service.getAdminADS(req.query);
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );

  // API = add images to adminADS
  app.post("/add-images-to-admin-ads", UserAuth, upload.array("images", 10), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

        const data = await service.addImagesToAdminADS(req.body);
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );

  // API = update adminADS by id
  app.put("/update-admin-ads", UserAuth, upload.array("images", 10), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

        const data = await service.updateAdminADSById(req.body);
        return res.json(data);
      } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  );

  //API = delete adminADS
  app.delete( "/delete-admin-ads", UserAuth, async (req: deleteAuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        let authUser: any = req.user;
        req.body.userId = authUser._id;
        const data = await service.deleteAdminADS({
          _id: req.query._id as string,
        });
        return res.status(200).json(data);
      } catch (err) {
        return res.status(500).json({ error: "Internal Server Error", err });
      }
    }
  );
};
