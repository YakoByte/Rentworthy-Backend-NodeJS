import { SubscriptionModel } from "../models";
import { Types } from "mongoose";
import {
  subscriptionRequest,
  subscriptionGetRequest,
  subscriptionUpdateRequest,
} from "../../interface/subscription";
import { generatePresignedUrl } from "../../utils/aws";

class SubscriptionRepository {
  //create Subscription
  async CreateSubscription(SubscriptionInputs: subscriptionRequest) {
    try {
      const existingSubscription = await  SubscriptionModel.findOne({ title: SubscriptionInputs.title })
      if(existingSubscription){
        const SubscriptionResult = await SubscriptionModel.findOneAndUpdate(
          { _id: existingSubscription._id },
          { ...SubscriptionInputs },
          { new: true }
        );
        return SubscriptionResult;
      }
      
      const SubscriptionResult = await SubscriptionModel.create(
        SubscriptionInputs
      );
      if (SubscriptionResult) {
        return SubscriptionResult;
      }
      return { message: "Failed to create Subscription" };
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Create Subscription");
    }
  }

  //get Subscription By Id
  async getSubscriptionById(SubscriptionInputs: subscriptionGetRequest) {
    try {
      const SubscriptionResult = await SubscriptionModel.aggregate([
        {
          $match: { _id: new Types.ObjectId(SubscriptionInputs._id), isActive: true, isDeleted: false },
        },
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }
            ],
            as: "images",
          },
        },
      ]);      
  
      if (!SubscriptionResult || SubscriptionResult.length === 0) {
        return { message: "No Subscription found" };
      }

      // Using map and Promise.all to process all asynchronous operations
      await Promise.all(SubscriptionResult.map(async (element) => {
        if (element.images.length > 0) {
          await Promise.all(element.images.map(async (image: any) => {
            let newPath = await generatePresignedUrl(image.imageName);
            image.path = newPath;
          }));
        }
      }));

      return SubscriptionResult;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Get Subscription");
    }
  }

  //get all Subscription
  async getAllSubscription({
    skip,
    limit,
  }: {
    skip: number;
    limit: number;
  }) {
    try {
      const SubscriptionResult = await SubscriptionModel.aggregate([
        { $match: { isActive: true, isDeleted: false } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }
            ],
            as: "images",
          },
        },
      ]);      
  
      if (!SubscriptionResult || SubscriptionResult.length === 0) {
        return { message: "No Subscription found" };
      }

      // Using map and Promise.all to process all asynchronous operations
      await Promise.all(SubscriptionResult.map(async (element) => {
        if (element.images.length > 0) {
          await Promise.all(element.images.map(async (image: any) => {
            let newPath = await generatePresignedUrl(image.imageName);
            image.path = newPath;
          }));
        }
      }));

      const countSubscription = await SubscriptionModel.countDocuments({isActive: true, isDeleted: false})
      
      return {SubscriptionResult, countSubscription};
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Get Subscription");
    }
  }

  //get Subscription  by title
  async getSubscriptionByTitle(SubscriptionInputs: subscriptionGetRequest) {
    try {   
      const SubscriptionResult = await SubscriptionModel.aggregate([
        {
          $match: { title: SubscriptionInputs.title, isActive: true, isDeleted: false },
        },
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }
            ],
            as: "images",
          },
        },
      ]);      
  
      if (!SubscriptionResult || SubscriptionResult.length === 0) {
        return { message: "No Subscription found" };
      }
  
      // Using map and Promise.all to process all asynchronous operations
      await Promise.all(SubscriptionResult.map(async (element) => {
        if (element.images.length > 0) {
          await Promise.all(element.images.map(async (image: any) => {
            let newPath = await generatePresignedUrl(image.imageName);
            image.path = newPath;
          }));
        }
      }));
  
      return SubscriptionResult;
    } catch (err) {
      console.error("Error:", err);
      throw new Error("Unable to Get Subscription");
    }
  }

  //get Subscription  by timelimit
  async getSubscriptionByTimeLimit(SubscriptionInputs: subscriptionGetRequest) {
    try {   
      const SubscriptionResult = await SubscriptionModel.aggregate([
        {
          $match: { timelimit: SubscriptionInputs.timelimit, isActive: true, isDeleted: false },
        },
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }
            ],
            as: "images",
          },
        },
      ]);      
  
      if (!SubscriptionResult || SubscriptionResult.length === 0) {
        return { message: "No Subscription found" };
      }
  
      // Using map and Promise.all to process all asynchronous operations
      await Promise.all(SubscriptionResult.map(async (element) => {
        if (element.images.length > 0) {
          await Promise.all(element.images.map(async (image: any) => {
            let newPath = await generatePresignedUrl(image.imageName);
            image.path = newPath;
          }));
        }
      }));
  
      return SubscriptionResult;
    } catch (err) {
      console.error("Error:", err);
      throw new Error("Unable to Get Subscription");
    }
  }

  //get Subscription  by point
  async getSubscriptionByPoint(SubscriptionInputs: subscriptionGetRequest) {
    try {   
      let point = SubscriptionInputs.points;

      const SubscriptionResult = await SubscriptionModel.aggregate([
        {
          $match: { points: point, isActive: true, isDeleted: false },
        },
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }
            ],
            as: "images",
          },
        },
      ]);      
  
      if (!SubscriptionResult || SubscriptionResult.length === 0) {
        return { message: "No Subscription found" };
      }
  
      // Using map and Promise.all to process all asynchronous operations
      await Promise.all(SubscriptionResult.map(async (element) => {
        if (element.images.length > 0) {
          await Promise.all(element.images.map(async (image: any) => {
            let newPath = await generatePresignedUrl(image.imageName);
            image.path = newPath;
          }));
        }
      }));
  
      return SubscriptionResult;
    } catch (err) {
      console.error("Error:", err);
      throw new Error("Unable to Get Subscription");
    }
  }

  //get Subscription  by title
  async getSubscriptionByPrice(SubscriptionInputs: subscriptionGetRequest) {
    try {  
      let price = SubscriptionInputs.price as unknown as number;
             
      const SubscriptionResult = await SubscriptionModel.aggregate([
        {
          $match: { price: price, isActive: true, isDeleted: false },
        },
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }
            ],
            as: "images",
          },
        },
      ]);      
  
      if (!SubscriptionResult || SubscriptionResult.length === 0) {
        return { message: "No Subscription found" };
      }
  
      // Using map and Promise.all to process all asynchronous operations
      await Promise.all(SubscriptionResult.map(async (element) => {
        if (element.images.length > 0) {
          await Promise.all(element.images.map(async (image: any) => {
            let newPath = await generatePresignedUrl(image.imageName);
            image.path = newPath;
          }));
        }
      }));
  
      return SubscriptionResult;
    } catch (err) {
      console.error("Error:", err);
      throw new Error("Unable to Get Subscription");
    }
  }

  //get Subscription  by currency
  async getSubscriptionByCurrency(SubscriptionInputs: subscriptionGetRequest) {
    try {             
      const SubscriptionResult = await SubscriptionModel.aggregate([
        {
          $match: { currency: SubscriptionInputs.currency, isActive: true, isDeleted: false },
        },
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            pipeline: [
              { $project: { _id: 1, mimetype: 1, path: 1, imageName: 1, size: 1, userId: 1 } }
            ],
            as: "images",
          },
        },
      ]);      
  
      if (!SubscriptionResult || SubscriptionResult.length === 0) {
        return { message: "No Subscription found" };
      }
  
      // Using map and Promise.all to process all asynchronous operations
      await Promise.all(SubscriptionResult.map(async (element) => {
        if (element.images.length > 0) {
          await Promise.all(element.images.map(async (image: any) => {
            let newPath = await generatePresignedUrl(image.imageName);
            image.path = newPath;
          }));
        }
      }));
  
      return SubscriptionResult;
    } catch (err) {
      console.error("Error:", err);
      throw new Error("Unable to Get Subscription");
    }
  }
  
  //update Subscription by id
  async updateSubscriptionById(SubscriptionInputs: subscriptionUpdateRequest) {
    try {      
      const SubscriptionResult = await SubscriptionModel.findOneAndUpdate(
        { _id: new Types.ObjectId(SubscriptionInputs._id) },
        { ...SubscriptionInputs },
        { new: true }
      );
      if (SubscriptionResult) {
        return SubscriptionResult;
      }
      return { messsage: "Failed to update Subscription" };
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Update Subscription");
    }
  }

  //delete Subscription by id
  async deleteSubscriptionById(SubscriptionInputs: { _id: string }) {
    try {
      const SubscriptionResult = await SubscriptionModel.findOneAndUpdate(
        { _id: SubscriptionInputs._id },
        { isDeleted: true },
        { new: true }
      );
      if (SubscriptionResult) {
        return { message: "Subscription Deleted" };
      }
      return false;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Delete Subscription");
    }
  }

  //get Subscription By Id
  async getSubscriptionPlanById(_id: string) {
    try {
      const SubscriptionResult = await SubscriptionModel.findById(_id)  
  
      if (!SubscriptionResult) {
        return { message: "No Subscription found" };
      }

      return SubscriptionResult;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Get Subscription");
    }
  }
}

export default SubscriptionRepository;
