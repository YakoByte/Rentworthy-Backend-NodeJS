import { AboutUSModel } from "../models";
import { Types } from "mongoose";
import {
  aboutUSRequest,
  aboutUSGetRequest,
  aboutUSUpdateRequest,
} from "../../interface/aboutUs";
import { generatePresignedUrl } from "../../utils/aws";
import mongoose from "mongoose";

class AboutUSRepository {
  //create aboutUS
  async CreateAboutUS(aboutUSInputs: aboutUSRequest) {
    try {
      const existingAboutUS = await AboutUSModel.findOne({title: aboutUSInputs.title, isDeleted: false});
      if(existingAboutUS){
        return existingAboutUS;
      }

      const aboutUSResult = await AboutUSModel.create(aboutUSInputs);
      if (aboutUSResult) {
        return aboutUSResult;
      }
      return { message: "Failed to create aboutUS" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Create About Us");
    }
  }

  //get one aboutUS
  async getAboutUS(aboutUSInputs: aboutUSGetRequest) {
    try {
      let criteria: any = { isDeleted: false };
      
      if (aboutUSInputs._id) {
        criteria._id = new Types.ObjectId(aboutUSInputs._id);
      }
      if (aboutUSInputs.description) {
        criteria.description = aboutUSInputs.description;
      }
      if (aboutUSInputs.title) {
        criteria.title = aboutUSInputs.title;
      }
      if (aboutUSInputs.images && aboutUSInputs.images.length > 0) {
        criteria.images = { $in: aboutUSInputs.images.map(image => new Types.ObjectId(image)) };
      }
  
      const aboutUSResult = await AboutUSModel.aggregate([
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
  
      if (!aboutUSResult || aboutUSResult.length === 0) {
        return { message: "No aboutUS" };
      }
  
      await Promise.all(
        aboutUSResult.map(async (about) => {
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
  
      return aboutUSResult;
    } catch (err) {
      console.error("Error:", err);
      throw new Error("Unable to Get About US");
    }
  }

  //add images to aboutUS
  async addImagesToAboutUS(aboutUSInputs: aboutUSUpdateRequest) {
    try {
      const aboutUSResult = await AboutUSModel.findOneAndUpdate(
        { _id: aboutUSInputs._id, isDeleted: false },
        { $push: { images: aboutUSInputs.images } },
        { new: true }
      );
      if (aboutUSResult) {
        return aboutUSResult;
      }
      return false;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Add images to about us");
    }
  }

  //update aboutUS by id
  async updateAboutUSById(aboutUSInputs: aboutUSUpdateRequest) {
    try {
      const aboutUSResult = await AboutUSModel.findOneAndUpdate(
        { _id: aboutUSInputs._id, isDeleted: false },
        { $set: aboutUSInputs },
        { new: true }
      );

      if (aboutUSResult) {
        return aboutUSResult;
      }
      return false;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Update About us");
    }
  }

  //delete aboutUS by id
  async deleteAboutUSById(aboutUSInputs: { _id: string }) {
    try {
      const aboutUSResult = await AboutUSModel.findOneAndUpdate(
        { _id: aboutUSInputs._id },
        { $set: { isDeleted: true } },
        { new: true }
      );
      if (aboutUSResult) {
        return { message: "aboutUS Deleted" };
      }
      return false;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Delete About US");
    }
  }
}

export default AboutUSRepository;
