import { TermConditionModel } from "../models";
import {
  termConditionRequest,
  termConditionGetRequest,
  termConditionUpdateRequest,
} from "../../interface/termCondition";

class TermConditionRepository {
  //create TermCondition
  async CreateTermCondition(TermConditionInputs: termConditionRequest) {
    try {
      const TermConditionResult = await TermConditionModel.create(
        TermConditionInputs
      );
      if (TermConditionResult) {
        return TermConditionResult;
      }
      return { message: "Failed to create TermCondition" };
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Create Term & Condition");
    }
  }

  //get all TermCondition
  async getTermConditionById(TermConditionInputs: termConditionGetRequest) {
    try {
      const TermConditionResult = await TermConditionModel.aggregate([
        {
          $match: { ...TermConditionInputs, isDeleted: false },
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
      if (!TermConditionResult) {
        return { message: "No TermCondition" };
      }
      
      return TermConditionResult;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Get Term & Condition");
    }
  }

  //get all TermCondition
  async getAllTermCondition() {
    try {
      const TermConditionResult = await TermConditionModel.aggregate([
        {
          $match: { isDeleted: false },
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
      if (!TermConditionResult) {
        return { message: "No TermCondition" };
      }
      return TermConditionResult;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Get Term & Condition");
    }
  }

  //get one TermCondition
  async getTermCondition(TermConditionInputs: termConditionGetRequest) {
    try {
      const TermConditionResult = await TermConditionModel.find(
        TermConditionInputs
      );
      if (!TermConditionResult) {
        return { message: "No TermCondition" };
      }
      return TermConditionResult;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Get Term & Condition");
    }
  }

  //add images to TermCondition
  async addImagesToTermCondition(
    TermConditionInputs: termConditionUpdateRequest
  ) {
    try {
      const TermConditionResult = await TermConditionModel.findOneAndUpdate(
        { _id: TermConditionInputs._id },
        { $set: { image: TermConditionInputs.image } },
        { new: true }
      );
      if (TermConditionResult) {
        return TermConditionResult;
      }
      return false;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to add image Term & Condition");
    }
  }

  //update TermCondition by id
  async updateTermConditionById(
    TermConditionInputs: termConditionUpdateRequest
  ) {
    try {
      const TermConditionResult = await TermConditionModel.findOneAndUpdate(
        { _id: TermConditionInputs._id },
        { $set: TermConditionInputs },
        { new: true }
      );

      if (TermConditionResult) {
        return TermConditionResult;
      }
      return false;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to update Term & Condition");
    }
  }

  //delete TermCondition by id
  async deleteTermConditionById(TermConditionInputs: { _id: string }) {
    try {
      const TermConditionResult = await TermConditionModel.findOneAndUpdate(
        { _id: TermConditionInputs._id },
        { isDeleted: true },
        { new: true }
      );
      if (TermConditionResult) {
        return { message: "TermCondition Deleted" };
      }
      return false;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Delete Term & Condition");
    }
  }
}

export default TermConditionRepository;
