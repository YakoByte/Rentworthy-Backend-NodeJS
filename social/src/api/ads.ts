import { Express, Request, Response, NextFunction } from "express";
import AdsService from "../services/ads";
import UserAuth from "../middlewares/auth";
import {
  AuthenticatedRequest,
  adsRequest,
  postAuthenticatedRequest,
  approveAuthenticatedRequest,
  deleteAuthenticatedRequest,
} from "../interface/ads";
import upload from "../middlewares/imageStorage";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";

async function uploadMultipleImagesWithToken(
  imagePaths: string[],
  token: string
): Promise<string[]> {
  const formData = new FormData();

  for (const imagePath of imagePaths) {
    formData.append("image", fs.createReadStream(imagePath));
  }

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

    const paths: string[] = response.data.map((element: any) => element._id);

    return paths;
  } catch (error: any) {
    return [error.message]; // Return an array to match the Promise<string[]> type
  }
}

export default (app: Express) => {
  const service = new AdsService();

  // API = create new ads
  app.post(
    "/create-ads",
    UserAuth,
    upload.array("image", 5),
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        let authUser: any = req.user;
        req.body.userId = authUser._id;
        // console.log("req.body", req.body)
        console.log("req.files", req.files);
        req.body.image = await uploadMultipleImagesWithToken(
          req.files.map((obj: { path: any }) => obj.path),
          req.headers.authorization
        );
        const data = await service.CreateAds(req.body);
        return res.json(data);
      } catch (err) {
        console.log("api err", err);
        return err;
      }
    }
  );

  // API = get ads by id and search and all ads
  app.get(
    "/get-ads",
    UserAuth,
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
        const data = await service.getAds({ ...req.query, user: authUser });
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );

  // API = add images to ads
  app.post(
    "/add-images-to-ads",
    UserAuth,
    upload.array("images", 10),
    async (
      req: postAuthenticatedRequest,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const data = await service.addImagesToAds(req.body);
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );

  // API = update ads by id
  app.put(
    "/update-ads-by-id",
    UserAuth,
    async (
      req: postAuthenticatedRequest,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const data = await service.updateAdsById({
          ...req.body,
          _id: req.query._id as string,
        });
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );

  //API = approve and reject ads
  app.put(
    "/approve-reject-ads",
    UserAuth,
    async (
      req: approveAuthenticatedRequest,
      res: Response,
      next: NextFunction
    ) => {
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
  app.delete(
    "/delete-ads",
    UserAuth,
    async (
      req: deleteAuthenticatedRequest,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const data = await service.deleteAds({ ...req.query });
        return res.json(data);
      } catch (err) {
        next(err);
      }
    }
  );
};
