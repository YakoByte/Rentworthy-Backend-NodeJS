import { bannerModel } from "../models";
import { Types } from "mongoose";
import {
  bannerRequest,
  bannerGetRequest,
  bannerUpdateRequest,
} from "../../interface/banner";
import { generatePresignedUrl } from "../../utils/aws";

class bannerRepository {
  //create banner
  async CreateBanner(bannerInputs: bannerRequest) {
    try {
      const existingbanner = await bannerModel.findOne({title: bannerInputs.title, isDeleted: false});
      if(existingbanner){
        return existingbanner;
      }

      const bannerResult = await bannerModel.create(bannerInputs);
      if (bannerResult) {
        return bannerResult;
      }
      return { message: "Failed to create banner" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Create About Us");
    }
  }

  //get banner
  async getBanner(bannerInputs: bannerGetRequest) {
    try {
      const skip = Number(bannerInputs.page) * Number(bannerInputs.limit) - Number(bannerInputs.limit) || 0;
      const limit = Number(bannerInputs.limit) || 10;

      let criteria: any = { isDeleted: false };
      
      if (bannerInputs._id) {
        criteria._id = new Types.ObjectId(bannerInputs._id);
      }
      if (bannerInputs.description) {
        criteria.description = bannerInputs.description;
      }
      if (bannerInputs.title) {
        criteria.title = bannerInputs.title;
      }
      if (bannerInputs.images && bannerInputs.images.length > 0) {
        criteria.images = { $in: bannerInputs.images.map(image => new Types.ObjectId(image)) };
      }
  
      const bannerResult = await bannerModel.aggregate([
        {
          $match: criteria,
        },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            as: "images",
          },
        },
        {
          $unwind: "$images",
        },
      ]);
  
      if (!bannerResult || bannerResult.length === 0) {
        return { message: "No banner" };
      }
  
      await Promise.all(
        bannerResult.map(async (about) => {
          if(about.images.length > 0) {
            await Promise.all(
              about.images.map(async (element: any) => {
                const newPath = await generatePresignedUrl(element.imageName);
                element.path = newPath;
              })
            );
          } 
        })
      );

      const countBanner = await bannerModel.countDocuments(criteria);
  
      return {bannerResult, countBanner};
    } catch (err) {
      console.error("Error:", err);
      throw new Error("Unable to Get About US");
    }
  }

  //add images to banner
  async addImagesToBanner(bannerInputs: bannerUpdateRequest) {
    try {
      const bannerResult = await bannerModel.findOneAndUpdate(
        { _id: bannerInputs._id, isDeleted: false },
        { $push: { images: bannerInputs.images } },
        { new: true }
      );
      if (bannerResult) {
        return bannerResult;
      }
      return false;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Add images to about us");
    }
  }

  //update banner by id
  async updateBannerById(bannerInputs: bannerUpdateRequest) {
    try {
      const bannerResult = await bannerModel.findOneAndUpdate(
        { _id: bannerInputs._id, isDeleted: false },
        { $set: bannerInputs },
        { new: true }
      );

      if (bannerResult) {
        return bannerResult;
      }
      return false;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Update About us");
    }
  }

  //delete banner by id
  async deleteBannerById(bannerInputs: { _id: string }) {
    try {
      const bannerResult = await bannerModel.findOneAndUpdate(
        { _id: bannerInputs._id },
        { $set: { isDeleted: true } },
        { new: true }
      );
      if (bannerResult) {
        return { message: "banner Deleted" };
      }
      return false;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Delete About US");
    }
  }
}

export default bannerRepository;
