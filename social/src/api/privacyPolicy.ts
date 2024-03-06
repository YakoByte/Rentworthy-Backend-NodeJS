import { Express, Request, Response, NextFunction } from "express";
import PrivacyPolicyService from "../services/privacyPolicy";
import UserAuth from "../middlewares/auth";
import {
  AuthenticatedRequest,
  deleteAuthenticatedRequest,
} from "../interface/privacyPolicy";
import upload from "../middlewares/imageStorage";
import imageService from "../services/imageUpload";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
// import multer from 'multer';
// import path from 'path';
// import { validateCreateAdmin } from './adminValidation';

// async function uploadImageWithToken(
//   imagePath: string,
//   token: string
// ): Promise<string> {
//   const formData = new FormData();
//   formData.append("image", fs.createReadStream(imagePath));

//   try {
//     const response = await axios.post(
//       "https://backend.rentworthy.us/web/api/v1/upload/image-uploads",
//       formData,
//       {
//         headers: {
//           ...formData.getHeaders(),
//           Authorization: token,
//         },
//       }
//     );

//     if (fs.existsSync(imagePath)) {
//       fs.unlinkSync(imagePath);
//     }

//     return response.data._id;
//   } catch (error: any) {
//     if (fs.existsSync(imagePath)) {
//       fs.unlinkSync(imagePath);
//     }
//     return error.message;
//   }
// }

export default (app: Express) => {
  const service = new PrivacyPolicyService();
  const image = new imageService();

  // API = create new privacyPolicy
  app.post("/create-privacyPolicy", UserAuth, upload.array('images', 10), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        let authUser: any = req.user;
        req.body.userId = authUser._id;

        // Check if req.file is defined before accessing its properties
        if (req.file) {
          const imageData = {
            userId: authUser._id,
            imageDetails: req.files,
          }

          req.body.images = await image.CreateImages(imageData);
        }

        const data = await service.CreatePrivacyPolicy(req.body);
        return res.json(data);
      } catch (err) {
        console.log("api err", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  );

  // API = get privacyPolicy by id and search and all privacyPolicy
  app.get("/get-privacyPolicy", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const data = await service.getPrivacyPolicy(req.query);
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );

  // API = add images to privacyPolicy
  app.post("/add-images-to-privacyPolicy", UserAuth, upload.array('images', 10), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

        const data = await service.addImagesToPrivacyPolicy(req.body);
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );

  // API = update privacyPolicy by id
  app.put("/update-privacyPolicy", UserAuth, upload.array('images', 10), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

  //API = delete privacyPolicy
  app.delete("/delete-privacyPolicy", UserAuth, async (req: deleteAuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        let authUser: any = req.user;
        req.body.userId = authUser._id;

        const data = await service.deletePrivacyPolicy(req.query);
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );
};
