import { SubscriptionModel } from "../models";
import {
  subscriptionRequest,
  subscriptionGetRequest,
  subscriptionUpdateRequest,
} from "../../interface/subscription";

class SubscriptionRepository {
  //create Subscription
  async CreateSubscription(SubscriptionInputs: subscriptionRequest) {
    try {
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

  //get all Subscription
  async getSubscriptionById(SubscriptionInputs: subscriptionGetRequest) {
    try {
      // const SubscriptionResult = await SubscriptionModel.findById(SubscriptionInputs._id);
      const SubscriptionResult = await SubscriptionModel.aggregate([
        {
          $match: { ...SubscriptionInputs, isDeleted: false },
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
      if (!SubscriptionResult) {
        return { message: "No Subscription" };
      }
      return SubscriptionResult;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Get Subscription");
    }
  }

  //get all Subscription
  async getAllSubscription() {
    try {
      // const SubscriptionResult = await SubscriptionModel.find();
      const SubscriptionResult = await SubscriptionModel.aggregate([
        {
          $match: { isDeleted: false },
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
      if (!SubscriptionResult) {
        return { message: "No Subscription" };
      }
      return SubscriptionResult;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Get Subscription");
    }
  }

  //get one Subscription
  async getSubscription(SubscriptionInputs: subscriptionGetRequest) {
    try {
      const SubscriptionResult = await SubscriptionModel.find(
        SubscriptionInputs
      );
      if (!SubscriptionResult) {
        return { message: "No Subscription" };
      }
      return SubscriptionResult;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Get Subscription");
    }
  }

  //update Subscription by id
  async updateSubscriptionById(SubscriptionInputs: subscriptionUpdateRequest) {
    try {
      const SubscriptionResult = await SubscriptionModel.findOneAndUpdate(
        { _id: SubscriptionInputs._id },
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
}

export default SubscriptionRepository;
