import { PrivacyPolicyModel } from "../models";
import {
  privacyPolicyRequest,
  privacyPolicyGetRequest,
  privacyPolicyUpdateRequest,
} from "../../interface/privacyPolicy";

class PrivacyPolicyRepository {
  //create PrivacyPolicy
  async CreatePrivacyPolicy(PrivacyPolicyInputs: privacyPolicyRequest) {
    try {
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

  //get all PrivacyPolicy
  async getPrivacyPolicyById(PrivacyPolicyInputs: privacyPolicyGetRequest) {
    try {
      const PrivacyPolicyResult = await PrivacyPolicyModel.findById(
        PrivacyPolicyInputs._id
      );
      if (!PrivacyPolicyResult) {
        return { message: "No PrivacyPolicy" };
      }
      return PrivacyPolicyResult;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Get Privacy");
    }
  }

  //get all PrivacyPolicy
  async getAllPrivacyPolicy() {
    try {
      const PrivacyPolicyResult = await PrivacyPolicyModel.find();
      if (!PrivacyPolicyResult) {
        return { message: "No PrivacyPolicy" };
      }
      return PrivacyPolicyResult;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Get Privacy");
    }
  }
  //get one PrivacyPolicy
  async getPrivacyPolicy(PrivacyPolicyInputs: privacyPolicyGetRequest) {
    try {
      const PrivacyPolicyResult = await PrivacyPolicyModel.aggregate([
        {
          $match: { ...PrivacyPolicyInputs, isDeleted: false },
        },
        {
          $lookup: {
            from: "images",
            localField: "image",
            foreignField: "_id",
            as: "image",
          },
        },
      ]);
      if (!PrivacyPolicyResult) {
        return { message: "No PrivacyPolicy" };
      }
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
        { $set: { image: PrivacyPolicyInputs.image } },
        { new: true }
      );
      if (PrivacyPolicyResult) {
        return PrivacyPolicyResult;
      }
      return false;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to add image to Privacy");
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
