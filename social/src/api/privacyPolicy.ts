import { Express, Request, Response, NextFunction } from "express";
import PrivacyPolicyService from "../services/privacyPolicy";
import UserAuth from "../middlewares/auth";
import { isAdmin } from "../middlewares/checkRole";
import {
  AuthenticatedRequest,
  deleteAuthenticatedRequest,
} from "../interface/privacyPolicy";
import upload from "../middlewares/imageStorage";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
// import multer from 'multer';
// import path from 'path';
// import { validateCreateAdmin } from './adminValidation';

async function uploadImageWithToken(
  imagePath: string,
  token: string
): Promise<string> {
  const formData = new FormData();
  formData.append("image", fs.createReadStream(imagePath));

  try {
    const response = await axios.post(
      "https://backend.rentworthy.us/web/api/v1/upload/image-uploads",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: token,
        },
      }
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    return response.data._id;
  } catch (error: any) {
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    return error.message;
  }
}

async function deleteImageWithToken(
  id: string,
  token: string
): Promise<string> {
  try {
    console.log(id, token);

    const response = await axios.delete(
      `https://backend.rentworthy.us/app/api/v1/upload/image-delete/${id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return response.data; // Assuming you are expecting a single image ID
  } catch (error: any) {
    return error.message;
  }
}

export default (app: Express) => {
  const service = new PrivacyPolicyService();

  // API = create new privacyPolicy
  app.post(
    "/create-privacyPolicy",
    UserAuth,
    upload.single("image"),
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        let authUser: any = req.user;
        req.body.userId = authUser._id;

        console.log("req.body", req.body);

        // Check if req.file is defined before accessing its properties
        if (req.file) {
          req.body.image = await uploadImageWithToken(
            req.file.path,
            req.headers.authorization
          );
        } else {
          return res.status(400).json({ error: "No file provided" });
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
  app.get(
    "/get-privacyPolicy",
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        let authUser = req.user as {
          _id: string;
          roleName: string;
          email: string;
        };
        // req.query.user = authUser;
        console.log("req.query", req.query);
        console.log("authUser", authUser);
        const data = await service.getPrivacyPolicy(req.query);
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );
  // API = get privacyPolicy by id and search and all privacyPolicy
  // app.get('/get-privacyPolicy/title', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  //     try {
  //         let authUser = req.user as { _id: string; roleName: string; email: string; };
  //         // req.query.user = authUser;
  //         console.log("req.query", req.query)
  //         console.log("authUser", authUser)
  //         const { data } = await service.getPrivacyPolicy({ ...req.query, user: authUser });
  //         return res.json(data);
  //     } catch (err) {
  //         next(err);
  //     }
  // });
  // // API = get privacyPolicy by id and search and all privacyPolicy
  // app.get('/get-privacyPolicy/all', UserAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  //     try {
  //         let authUser = req.user as { _id: string; roleName: string; email: string; };
  //         // req.query.user = authUser;
  //         console.log("req.query", req.query)
  //         console.log("authUser", authUser)
  //         const { data } = await service.getAllPrivacyPolicy({ ...req.query, user: authUser });
  //         return res.json(data);
  //     } catch (err) {
  //         next(err);
  //     }
  // });
  // API = add images to privacyPolicy
  app.post(
    "/add-images-to-privacyPolicy",
    UserAuth,
    upload.single("image"),
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        let authUser: any = req.user;
        req.body.userId = authUser._id;

        if (req.file) {
          req.body.image = await uploadImageWithToken(
            req.file.path,
            req.headers.authorization
          );
        }

        const data = await service.addImagesToPrivacyPolicy(req.body);
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );
  // API = update privacyPolicy by id
  app.put(
    "/update-privacyPolicy",
    UserAuth,
    upload.single("image"),
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        let authUser: any = req.user;
        req.body.userId = authUser._id;

        if (req.file) {
          req.body.image = await uploadImageWithToken(
            req.file.path,
            req.headers.authorization
          );
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
  app.delete(
    "/delete-privacyPolicy",
    UserAuth,
    async (
      req: deleteAuthenticatedRequest,
      res: Response,
      next: NextFunction
    ) => {
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
