import { ComplainModel, historyModel } from "../models";
import { Types } from "mongoose";
import {
  ComplainRequest,
  ComplainDeleteRequest,
  ComplainUpdateRequest,
  ComplainGetRequest,
} from "../../interface/complain";
import { generatePresignedUrl } from "../../utils/aws";

class ComplainRepository {
  //create Complain
  async CreateComplain(ComplainInputs: ComplainRequest) {
    try {
      const findComplain = await ComplainModel.findOne({
        productId: ComplainInputs.productId,
        userId: ComplainInputs.userId,
      });

      if (findComplain) {
        return { _id: findComplain._id, name: findComplain.name };
      }

      const Complain = new ComplainModel(ComplainInputs);
      const ComplainResult = await Complain.save();

      const history = new historyModel({
        ComplainId: ComplainInputs._id,
        log: [
          {
            objectId: ComplainInputs._id,
            userId: ComplainInputs.userId,
            action: `ComplainName = ${ComplainInputs.name} updated`,
            date: new Date().toISOString(),
            time: Date.now(),
          },
        ],
      });

      await history.save();

      return ComplainResult;
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Create Compamin");
    }
  }

  //get Complain by id
  async getComplainById(ComplainInputs: { _id: string }) {
    try {
      const findComplain = await ComplainModel.aggregate([
        {
          $match: {
            _id: new Types.ObjectId(ComplainInputs._id),
            isDeleted: false,
          },
        },
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "images",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            pipeline: [
              { $project: { password: 0, salt: 0, isDeleted: 0, isActive: 0 } },
            ],
            as: "userId",
          },
        },
      ]);

      if (findComplain.length > 0) {
        await Promise.all(
          findComplain.map(async (complaint: any) => {
            await Promise.all(
              complaint.images.map(async (element: any) => {
                const newPath = await generatePresignedUrl(element.imageName);
                element.path = newPath;
              })
            );
          })
        );
        return findComplain;
      }
      return { message: "No Data Found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get Compalin");
    }
  }

  // get Complain by user id
  async getComplainByUserId(ComplainInputs: ComplainGetRequest) {
    try {
      const findComplain = await ComplainModel.aggregate([
        {
          $match: {
            userId: new Types.ObjectId(ComplainInputs.userId),
            isDeleted: false,
          },
        },
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "images",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            pipeline: [
              { $project: { password: 0, salt: 0, isDeleted: 0, isActive: 0 } },
            ],
            as: "userId",
          },
        },
      ]);

      if (findComplain) {
        await Promise.all(
          findComplain.map(async (complaint: any) => {
            await Promise.all(
              complaint.images.map(async (element: any) => {
                const newPath = await generatePresignedUrl(element.imageName);
                element.path = newPath;
              })
            );
          })
        );
        return findComplain;
      }
      return { message: "No Data Found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get Compalin");
    }
  }

  // get Complain by product id
  async getComplainByProductId(ComplainInputs: ComplainGetRequest) {
    try {
      const findComplain = await ComplainModel.aggregate([
        {
          $match: {
            productId: new Types.ObjectId(ComplainInputs.productId),
            isDeleted: false,
          },
        },
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "images",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            pipeline: [
              { $project: { password: 0, salt: 0, isDeleted: 0, isActive: 0 } },
            ],
            as: "userId",
          },
        },
      ]);

      if (findComplain) {
        await Promise.all(
          findComplain.map(async (complaint: any) => {
            await Promise.all(
              complaint.images.map(async (element: any) => {
                const newPath = await generatePresignedUrl(element.imageName);
                element.path = newPath;
              })
            );
          })
        );
        return findComplain;
      }
      return { message: "No Data Found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get Compalin");
    }
  }

  //get all Complain
  async getAllComplain({ skip, limit }: { skip: number; limit: number }) {
    try {
      const findComplain = await ComplainModel.aggregate([
        { $match: { isDeleted: false } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "images",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            pipeline: [
              { $project: { password: 0, salt: 0, isDeleted: 0, isActive: 0 } },
            ],
            as: "userId",
          },
        },
      ]);

      if (findComplain) {
        await Promise.all(
          findComplain.map(async (complaint: any) => {
            await Promise.all(
              complaint.images.map(async (element: any) => {
                const newPath = await generatePresignedUrl(element.imageName);
                element.path = newPath;
              })
            );
          })
        );
        return findComplain;
      }

      return { message: "No Data Found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get Compalin");
    }
  }

  // get Complain by location
  async getComplainByLocation(ComplainInputs: { lat: number; long: number }) {
    try {
      const findComplain = await ComplainModel.aggregate([
        { $match: { isDeleted: false } },
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [ComplainInputs.lat, ComplainInputs.long],
            },
            distanceField: "dist.calculated",
            maxDistance: 100000,
            includeLocs: "dist.location",
            spherical: true,
          },
        },
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "images",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            pipeline: [
              { $project: { password: 0, salt: 0, isDeleted: 0, isActive: 0 } },
            ],
            as: "userId",
          },
        },
      ]);

      if (findComplain) {
        await Promise.all(
          findComplain[0].images.map(async (element: any) => {
            const newPath = await generatePresignedUrl(element.imageName);
            element.path = newPath;
          })
        );
        return findComplain;
      }

      return { message: "No Data Found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get Compalin");
    }
  }

  // get Complain by name and search using regex
  async getComplainByName(ComplainInputs: { name: string }) {
    try {
      const findComplain = await ComplainModel.aggregate([
        {
          $match: {
            name: { $regex: ComplainInputs.name, $options: "i" },
            isDeleted: false,
          },
        },
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }],
            as: "images",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            pipeline: [
              { $project: { password: 0, salt: 0, isDeleted: 0, isActive: 0 } },
            ],
            as: "userId",
          },
        },
      ]);

      if (findComplain) {
        await Promise.all(
          findComplain.map(async (complaint: any) => {
            await Promise.all(
              complaint.images.map(async (element: any) => {
                const newPath = await generatePresignedUrl(element.imageName);
                element.path = newPath;
              })
            );
          })
        );
        return findComplain;
      }
      
      return { message: "No Data Found" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Get Compalin");
    }
  }

  //update Complain name, description, isActive, isShow, image
  async updateComplain(ComplainInputs: ComplainUpdateRequest) {
    try {
      const ComplainResult = await ComplainModel.findOneAndUpdate(
        { _id: ComplainInputs._id, isDeleted: false },
        ComplainInputs,
        { new: true } // Return the modified document
      );

      if (ComplainResult) {
        const history = new historyModel({
          ComplainId: ComplainInputs._id,
          log: [
            {
              objectId: ComplainInputs._id,
              userId: ComplainInputs.userId,
              action: `ComplainName = ${ComplainInputs.name} updated`,
              date: new Date().toISOString(),
              time: Date.now(),
            },
          ],
        });

        await history.save();

        return { message: "Complain Updated" };
      }
      return { message: "Complain not found or already deleted" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Update Compalin");
    }
  }

  async deleteComplain(ComplainInputs: ComplainDeleteRequest) {
    try {
      const findComplain = await ComplainModel.findOne({
        _id: ComplainInputs._id,
        isDeleted: false,
      });

      if (findComplain) {
        // soft delete Complain
        await ComplainModel.updateOne(
          { _id: ComplainInputs._id },
          { isDeleted: true }
        );

        //create history
        const history = new historyModel({
          ComplainId: ComplainInputs._id,
          log: [
            {
              objectId: ComplainInputs._id,
              userId: ComplainInputs.userId,
              action: `ComplainName = ${findComplain.name} deleted and subComplain also deleted`,
              date: new Date().toISOString(),
              time: Date.now(),
            },
          ],
        });
        await history.save();

        return { message: "Complain Deleted" };
      }

      return { message: "Complain not found or already deleted" };
    } catch (err) {
      console.log("error", err);
      throw new Error("Unable to Update Compalin");
    }
  }
}

export default ComplainRepository;
