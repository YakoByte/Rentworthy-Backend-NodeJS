import { Express, Request, Response, NextFunction } from "express";
import AdsService from "../services/ads";
import UserAuth from "../middlewares/auth";
import {
  AuthenticatedRequest,
  approveAuthenticatedRequest,
  deleteAuthenticatedRequest,
} from "../interface/ads";
import upload from "../middlewares/imageStorage";
import imageService from "../services/imageUpload";

export default (app: Express) => {
  const service = new AdsService();
  const image = new imageService();

  // API = create new ads
  app.post( "/create-ads", UserAuth, upload.array("images", 10), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

        const data = await service.CreateAds(req.body);
        return res.json(data);
      } catch (err) {
        console.log("api err", err);
        return err;
      }
    }
  );

  // API = get ads by id and search and all ads
  app.get("/get-ads-unauthorised", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {       
        const data = await service.getAds(req.query);
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );

  // API = get ads by id and search and all ads
  app.get("/get-ads", UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      let authUser = req.user as {
        _id: string;
        roleName: string;
        email: string;
      };
      
      const data = await service.getAds({ ...req.query, user: authUser });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  // API = add images to ads
  app.post("/add-images-to-ads", UserAuth, upload.array('images', 10), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
        
        const data = await service.addImagesToAds(req.body);
        return res.json(data);
      } catch (err) {
        next(err);
      }
  });

  // API = update ads by id
  app.put("/update-ads-by-id", UserAuth, upload.array('images', 10), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

        const data = await service.updateAdsById({...req.body, _id: req.query._id as string});
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );

  //API = approve and reject ads
  app.put("/approve-reject-ads", UserAuth, async ( req: approveAuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        let authUser = req.user as {
          _id: string;
          roleName: string;
          email: string;
        };
        const data = await service.approveAds({
          ...req.body,
          approvedBy: authUser._id,
          _id: req.query._id as string,
        });
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );

  //API = delete ads
  app.delete("/delete-ads", UserAuth, async (req: deleteAuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const data = await service.deleteAds({ ...req.query });
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );
};
