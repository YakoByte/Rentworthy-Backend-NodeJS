import { adminADSModel } from "../models";
import { Types } from "mongoose";
import {
  adminADSRequest,
  adminADSGetRequest,
  adminADSUpdateRequest,
} from "../../interface/adminADS";
import { generatePresignedUrl } from "../../utils/aws";
import mongoose from "mongoose";

class adminADSRepository {
  //create adminADS
  async CreateAdminADS(adminADSInputs: adminADSRequest) {
    try {
      const existingadminADS = await adminADSModel.findOne({title: adminADSInputs.title, isDeleted: false});
      if(existingadminADS){
        return existingadminADS;
      }

      const adminADSResult = await adminADSModel.create(adminADSInputs);
      if (adminADSResult) {
        return adminADSResult;
      }
      return { message: "Failed to create adminADS" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Create About Us");
    }
  }

  //get one adminADS
  async getAdminADS(adminADSInputs: adminADSGetRequest) {
    try {
      let criteria: any = { isDeleted: false };
      
      if (adminADSInputs._id) {
        criteria._id = new Types.ObjectId(adminADSInputs._id);
      }
      if (adminADSInputs.description) {
        criteria.description = adminADSInputs.description;
      }
      if (adminADSInputs.title) {
        criteria.title = adminADSInputs.title;
      }
      if (adminADSInputs.images && adminADSInputs.images.length > 0) {
        criteria.images = { $in: adminADSInputs.images.map(image => new Types.ObjectId(image)) };
      }
  
      const adminADSResult = await adminADSModel.aggregate([
        {
          $match: criteria,
        },
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
  
      if (!adminADSResult || adminADSResult.length === 0) {
        return { message: "No adminADS" };
      }
  
      await Promise.all(
        adminADSResult.map(async (about) => {
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
  
      return adminADSResult;
    } catch (err) {
      console.error("Error:", err);
      throw new Error("Unable to Get About US");
    }
  }

  //add images to adminADS
  async addImagesToAdminADS(adminADSInputs: adminADSUpdateRequest) {
    try {
      const adminADSResult = await adminADSModel.findOneAndUpdate(
        { _id: adminADSInputs._id, isDeleted: false },
        { $push: { images: adminADSInputs.images } },
        { new: true }
      );
      if (adminADSResult) {
        return adminADSResult;
      }
      return false;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Add images to about us");
    }
  }

  //update adminADS by id
  async updateAdminADSById(adminADSInputs: adminADSUpdateRequest) {
    try {
      const adminADSResult = await adminADSModel.findOneAndUpdate(
        { _id: adminADSInputs._id, isDeleted: false },
        { $set: adminADSInputs },
        { new: true }
      );

      if (adminADSResult) {
        return adminADSResult;
      }
      return false;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Update About us");
    }
  }

  //delete adminADS by id
  async deleteAdminADSById(adminADSInputs: { _id: string }) {
    try {
      const adminADSResult = await adminADSModel.findOneAndUpdate(
        { _id: adminADSInputs._id },
        { $set: { isDeleted: true } },
        { new: true }
      );
      if (adminADSResult) {
        return { message: "adminADS Deleted" };
      }
      return false;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Delete About US");
    }
  }
}

export default adminADSRepository;
