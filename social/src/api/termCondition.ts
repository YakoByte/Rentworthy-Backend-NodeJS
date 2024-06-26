import { Express, Request, Response, NextFunction } from "express";
import TermConditionService from "../services/termCondition";
import UserAuth from "../middlewares/auth";
import {
  AuthenticatedRequest,
  deleteAuthenticatedRequest,
} from "../interface/termCondition";
import upload from "../middlewares/imageStorage";
import imageService from "../services/imageUpload";

export default (app: Express) => {
  const service = new TermConditionService();
  const image = new imageService();

  // API = create new termCondition
  app.post("/create-termCondition", UserAuth, upload.array('images', 10),async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

        const data = await service.CreateTermCondition(req.body);
        return res.json(data);
      } catch (err) {
        console.log("api err", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  );

  // API = get termCondition by id and search and all termCondition
  app.get("/get-termCondition", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const data = await service.getTermCondition(req.query);
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );

  // API = add images to termCondition
  app.post("/add-images-to-termCondition", UserAuth, upload.array('images', 10), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

        const data = await service.addImagesToTermCondition(req.body);
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );

  // API = update termCondition by id
  app.put("/update-termCondition", UserAuth,upload.array('images', 10), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

        const data = await service.updateById(req.body);
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );

  //API = delete termCondition
  app.delete("/delete-termCondition", UserAuth, async ( req: deleteAuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        let authUser: any = req.user;
        req.body.userId = authUser._id;

        const data = await service.deleteTermCondition(req.query);
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );
};
