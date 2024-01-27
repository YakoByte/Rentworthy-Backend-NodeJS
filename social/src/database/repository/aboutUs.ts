import { AboutUSModel } from "../models";
import {
  aboutUSRequest,
  aboutUSGetRequest,
  aboutUSUpdateRequest,
} from "../../interface/aboutUs";

class AboutUSRepository {
  //create aboutUS
  async CreateAboutUS(aboutUSInputs: aboutUSRequest) {
    try {
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

  //get all aboutUS
  // async getAboutUSById(aboutUSInputs: aboutUSGetRequest) {
  //     try {
  //         const aboutUSResult = await AboutUSModel.findById(aboutUSInputs._id);
  //         if (!aboutUSResult) {
  //             return FormateData("No aboutUS");
  //         }
  //         return FormateData(aboutUSResult);
  //     } catch (err: any) {
  //         console.log("err", err)
  //         throw new APIError("Data Not found", err);
  //     }
  // }
  // //get all aboutUS
  // async getAllAboutUS() {
  //     try {
  //         const aboutUSResult = await AboutUSModel.find({ isDeleted: false });
  //         if (!aboutUSResult) {
  //             return FormateData("No aboutUS");
  //         }
  //         return FormateData(aboutUSResult);
  //     } catch (err: any) {
  //         console.log("err", err)
  //         throw new APIError("Data Not found", err);
  //     }
  // }

  //get one aboutUS
  async getAboutUS(aboutUSInputs: aboutUSGetRequest) {
    try {
      // const aboutUSResult = await AboutUSModel.find({ ...aboutUSInputs, isDeleted: false });
      const aboutUSResult = await AboutUSModel.aggregate([
        {
          $match: { ...aboutUSInputs, isDeleted: false },
        },
        {
          $lookup: {
            from: "images",
            localField: "image",
            foreignField: "_id",
            as: "image",
          },
        },
        {
          $unwind: "$image",
        },
        {
          $project: {
            _id: 1,
            image: 1,
            title: 1,
            description: 1,
            isDeleted: 1,
          },
        },
      ]);
      if (!aboutUSResult) {
        return { message: "No aboutUS" };
      }

      return aboutUSResult;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get Abount US");
    }
  }

  //add images to aboutUS
  async addImagesToAboutUS(aboutUSInputs: aboutUSUpdateRequest) {
    try {
      const aboutUSResult = await AboutUSModel.findOneAndUpdate(
        { _id: aboutUSInputs._id, isDeleted: false },
        { $set: { image: aboutUSInputs.image } },
        { new: true }
      );
      if (aboutUSResult) {
        return aboutUSResult;
      }
      return false;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Add image to about us");
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
