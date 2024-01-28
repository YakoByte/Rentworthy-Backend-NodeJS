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

        console.log("req.body", req.body);

        // Check if req.file is defined before accessing its properties
        if (req.files) {
          const imageData = {
            userId: authUser._id,
            imageDetails: req.files,
          }
  
            req.body.images = await image.CreateImages(imageData);
          
        } else {
          return res.status(400).json({ error: "No file provided" });
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
        // let authUser = req.user as { _id: string; roleName: string; email: string; };
        // req.query.user = authUser;
        console.log("req.query", req.query);
        // console.log("authUser", authUser)
        const data = await service.getTermCondition(req.query);
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );

  // // API = get termCondition by id and search and all termCondition
  // app.get('/get-termCondition/title', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  //     try {
  //         let authUser = req.user as { _id: string; roleName: string; email: string; };
  //         // req.query.user = authUser;
  //         console.log("req.query", req.query)
  //         console.log("authUser", authUser)
  //         const { data } = await service.getTermCondition({ ...req.query, user: authUser });
  //         return res.json(data);
  //     } catch (err) {
  //         next(err);
  //     }
  // });
  // // API = get termCondition by id and search and all termCondition
  // app.get('/get-termCondition/all', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  //     try {
  //         let authUser = req.user as { _id: string; roleName: string; email: string; };
  //         // req.query.user = authUser;
  //         console.log("req.query", req.query)
  //         console.log("authUser", authUser)
  //         const { data } = await service.getAllTermCondition({ ...req.query, user: authUser });
  //         return res.json(data);
  //     } catch (err) {
  //         next(err);
  //     }
  // });
  // API = add images to termCondition
  app.post("/add-images-to-termCondition", UserAuth, upload.array('images', 10), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        let authUser: any = req.user;
        req.body.userId = authUser._id;
        
        if (req.files) {
          const imageData = {
            userId: authUser._id,
            imageDetails: req.files,
          }

          req.body.images = await image.CreateImages(imageData);
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

        if (req.file) {
          const imageData = {
            userId: authUser._id,
            imageDetails: req.files,
          }

          req.body.images = await image.CreateImages(imageData);
        }

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
