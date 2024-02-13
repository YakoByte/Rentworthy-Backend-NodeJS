import { TermConditionModel } from "../models";
import { Types } from "mongoose";
import {
  termConditionRequest,
  termConditionGetRequest,
  termConditionUpdateRequest,
} from "../../interface/termCondition";
import { generatePresignedUrl } from "../../utils/aws";

class TermConditionRepository {
  //create TermCondition
  async CreateTermCondition(TermConditionInputs: termConditionRequest) {
    try {
      const existingTermCondition = await TermConditionModel.findOne({title: TermConditionInputs.title, isDeleted: false});
      if(existingTermCondition){
        return existingTermCondition;
      }

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

  //get one TermCondition
  async getTermCondition(TermConditionInputs: termConditionGetRequest) {
    try {
      let criteria: any = { isDeleted: false };
      
      if (TermConditionInputs._id) {
        criteria._id = new Types.ObjectId(TermConditionInputs._id);
      }
      if (TermConditionInputs.description) {
        criteria.description = TermConditionInputs.description;
      }
      if (TermConditionInputs.title) {
        criteria.title = TermConditionInputs.title;
      }
      if (TermConditionInputs.images && TermConditionInputs.images.length > 0) {
        criteria.images = { $in: TermConditionInputs.images.map(image => new Types.ObjectId(image)) };
      }

      const TermConditionResult = await TermConditionModel.aggregate([
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
        }
      ]);
      
      if (!TermConditionResult || TermConditionResult.length === 0) {
        return { message: "No Privacy Policy" };
      }
  
      await Promise.all(
        TermConditionResult.map(async (terms) => {
          if(terms.images.length > 0) {
            await Promise.all(
              terms.images.map(async (element: any) => {
                const newPath = await generatePresignedUrl(element.imageName);
                element.path = newPath;
              })
            );
          } 
        })
      );

      return TermConditionResult;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Get Term & Condition");
    }
  }

  //add images to TermCondition
  async addImagesToTermCondition(TermConditionInputs: termConditionUpdateRequest) {
    try {
      const TermConditionResult = await TermConditionModel.findOneAndUpdate(
        { _id: TermConditionInputs._id },
        { $set: { images: TermConditionInputs.images } },
        { new: true }
      );
      if (TermConditionResult) {
        return TermConditionResult;
      }
      return false;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to add images Term & Condition");
    }
  }

  //update TermCondition by id
  async updateTermConditionById(TermConditionInputs: termConditionUpdateRequest) {
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
