import { PrivacyPolicyModel } from "../models";
import { Types } from "mongoose";
import {
  privacyPolicyRequest,
  privacyPolicyGetRequest,
  privacyPolicyUpdateRequest,
} from "../../interface/privacyPolicy";
import { generatePresignedUrl } from "../../utils/aws";

class PrivacyPolicyRepository {
  //create PrivacyPolicy
  async CreatePrivacyPolicy(PrivacyPolicyInputs: privacyPolicyRequest) {
    try {
      const existingPrivacyPolicy = await PrivacyPolicyModel.findOne({title: PrivacyPolicyInputs.title, isDeleted: false});
      if(existingPrivacyPolicy){
        return existingPrivacyPolicy;
      }

      const PrivacyPolicyResult = await PrivacyPolicyModel.create(
        PrivacyPolicyInputs
      );
      if (PrivacyPolicyResult) {
        return PrivacyPolicyResult;
      }
      return { message: "Failed to create PrivacyPolicy" };
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Create Privacy");
    }
  }

  //get one PrivacyPolicy
  async getPrivacyPolicy(PrivacyPolicyInputs: privacyPolicyGetRequest) {
    try {
      let criteria: any = { isDeleted: false };
      
      if (PrivacyPolicyInputs._id) {
        criteria._id = new Types.ObjectId(PrivacyPolicyInputs._id);
      }
      if (PrivacyPolicyInputs.description) {
        criteria.description = PrivacyPolicyInputs.description;
      }
      if (PrivacyPolicyInputs.title) {
        criteria.title = PrivacyPolicyInputs.title;
      }
      if (PrivacyPolicyInputs.images && PrivacyPolicyInputs.images.length > 0) {
        criteria.images = { $in: PrivacyPolicyInputs.images.map(image => new Types.ObjectId(image)) };
      }

      const PrivacyPolicyResult = await PrivacyPolicyModel.aggregate([
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
      ]);

      if (!PrivacyPolicyResult || PrivacyPolicyResult.length === 0) {
        return { message: "No Privacy Policy" };
      }
  
      await Promise.all(
        PrivacyPolicyResult.map(async (privacy) => {
          if(privacy.images.length > 0) {
            await Promise.all(
              privacy.images.map(async (element: any) => {
                const newPath = await generatePresignedUrl(element.imageName);
                element.path = newPath;
              })
            );
          } 
        })
      );

      return PrivacyPolicyResult;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Get Privacy");
    }
  }

  //add images to PrivacyPolicy
  async addImagesToPrivacyPolicy(
    PrivacyPolicyInputs: privacyPolicyUpdateRequest
  ) {
    try {
      const PrivacyPolicyResult = await PrivacyPolicyModel.findOneAndUpdate(
        { _id: PrivacyPolicyInputs._id },
        { $set: { images: PrivacyPolicyInputs.images } },
        { new: true }
      );
      if (PrivacyPolicyResult) {
        return PrivacyPolicyResult;
      }
      return false;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to add images to Privacy");
    }
  }

  //update PrivacyPolicy by id
  async updatePrivacyPolicyById(
    PrivacyPolicyInputs: privacyPolicyUpdateRequest
  ) {
    try {
      const PrivacyPolicyResult = await PrivacyPolicyModel.findOneAndUpdate(
        { _id: PrivacyPolicyInputs._id },
        { $set: PrivacyPolicyInputs },
        { new: true }
      );

      if (PrivacyPolicyResult) {
        return PrivacyPolicyResult;
      }
      return { message: "Failed to update PrivacyPolicy" };
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to update Privacy");
    }
  }

  //delete PrivacyPolicy by id
  async deletePrivacyPolicyById(PrivacyPolicyInputs: { _id: string }) {
    try {
      const PrivacyPolicyResult = await PrivacyPolicyModel.findOneAndUpdate(
        { _id: PrivacyPolicyInputs._id },
        { isDeleted: true },
        { new: true }
      );
      if (PrivacyPolicyResult) {
        return { message: "PrivacyPolicy Deleted" };
      }
      return false;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to delete Privacy");
    }
  }
}

export default PrivacyPolicyRepository;
