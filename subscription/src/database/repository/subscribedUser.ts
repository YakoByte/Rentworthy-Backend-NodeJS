import { SubscribedUserModel, UsersModel } from "../models";
import {
    SubscribedUserRequest,
  SubscribedUserGetRequest,
  SubscribedUserUpdateRequest,
} from "../../interface/subscribedUser";

class SubscribedUserRepository {
  //create SubscribedUser
  async CreateSubscribedUser(SubscribedUserInputs: SubscribedUserRequest) {
    try {
      const SubscribedUserResult = await SubscribedUserModel.create(
        SubscribedUserInputs
      );
      if (SubscribedUserResult) {
        await UsersModel.findByIdAndUpdate(SubscribedUserInputs.userId, { isSubscribed: true }, { new: true });
        return SubscribedUserResult;
      }
      return { message: "Failed to create SubscribedUser" };
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Create SubscribedUser");
    }
  }

  //get all SubscribedUser
  async getSubscribedUserById(SubscribedUserInputs: SubscribedUserGetRequest) {
    try {
      const SubscribedUserResult = await SubscribedUserModel.aggregate([
        {
          $match: { _id: SubscribedUserInputs._id, isDeleted: false },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetail",
          },
        },
        {
          $lookup: {
            from: "subscriptions",
            localField: "subscriptionPlan",
            foreignField: "_id",
            as: "subscriptionPlan",
          },
        },
        {
          $lookup: {
            from: "payments",
            localField: "Payment",
            foreignField: "_id",
            as: "paymentDetails",
          },
        },
        {
          $unwind: "$userDetail",
        },
        {
          $unwind: "$subscriptionPlan",
        },
        {
          $unwind: "$paymentDetails",
        },
      ]);
  
      if (!SubscribedUserResult || SubscribedUserResult.length === 0) {
        return { message: "No SubscribedUser found" };
      }

      return SubscribedUserResult;
    } catch (err: any) {
      console.error("Error:", err);
      throw new Error("Unable to Get SubscribedUser");
    }
  }  

  //get all SubscribedUser
  async getAllSubscribedUser() {
    try {
      // const SubscribedUserResult = await SubscribedUserModel.find();
      const SubscribedUserResult = await SubscribedUserModel.aggregate([
        {
          $match: { isDeleted: false },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetail",
          },
        },
        {
          $lookup: {
            from: "subscriptions",
            localField: "subscriptionPlan",
            foreignField: "_id",
            as: "subscriptionPlan",
          },
        },
        {
          $lookup: {
            from: "payments",
            localField: "Payment",
            foreignField: "_id",
            as: "paymentDetails",
          },
        },
        {
          $unwind: "$userDetail",
        },
        {
          $unwind: "$subscriptionPlan",
        },
        {
          $unwind: "$paymentDetails",
        },
      ]);

      if (!SubscribedUserResult) {
        return { message: "No SubscribedUser" };
      }
      
      return SubscribedUserResult;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Get SubscribedUser");
    }
  }

  //get SubscribedUser By userId
  async getSubscribedUserByUserId(SubscribedUserInputs: SubscribedUserGetRequest) {
    try {
      const SubscribedUserResult = await SubscribedUserModel.aggregate([
        {
          $match: { _id: SubscribedUserInputs.userId, isDeleted: false },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetail",
          },
        },
        {
          $lookup: {
            from: "subscriptions",
            localField: "subscriptionPlan",
            foreignField: "_id",
            as: "subscriptionPlan",
          },
        },
        {
          $lookup: {
            from: "payments",
            localField: "Payment",
            foreignField: "_id",
            as: "paymentDetails",
          },
        },
        {
          $unwind: "$userDetail",
        },
        {
          $unwind: "$subscriptionPlan",
        },
        {
          $unwind: "$paymentDetails",
        },
      ]);

      if (!SubscribedUserResult) {
        return { message: "No SubscribedUser" };
      }
      return SubscribedUserResult;
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Get SubscribedUser");
    }
  }

  //get one SubscribedUser
  async getSubscribedUser(SubscriptionInputs: SubscribedUserGetRequest) {
    try {
      const SubscriptionResult = await SubscribedUserModel.find(
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

  //update SubscribedUser by id
  async updateSubscribedUserById(SubscribedUserInputs: SubscribedUserUpdateRequest) {
    try {
      const SubscribedUserResult = await SubscribedUserModel.findOneAndUpdate(
        { _id: SubscribedUserInputs._id },
        { ...SubscribedUserInputs },
        { new: true }
      );

      if(SubscribedUserInputs.paymentId) {
        await UsersModel.findByIdAndUpdate(SubscribedUserResult?.userId, { isSubscribed: true }, { new: true });
      }

      if (SubscribedUserResult) {
        return SubscribedUserResult;
      }

      return { messsage: "Failed to update SubscribedUser" };
    } catch (err: any) {
      console.log("error", err);
      throw new Error("Unable to Update SubscribedUser");
    }
  }

  //delete SubscribedUser by id
  async deleteSubscribedUserById(SubscribedUserInputs: { _id: string }) {
    try {
      const existingSubscribedUser = await SubscribedUserModel.findById(SubscribedUserInputs._id);
  
      if (!existingSubscribedUser) {
        return { message: "SubscribedUser not found" };
      }
  
      const currentTime = new Date();
      const updatedAtTime = new Date(existingSubscribedUser.DateofSubscription);
      const timeDifference = currentTime.getTime() - updatedAtTime.getTime();
      const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
  
      // Check if updatedAt is more than or equal to 2 days
      if (daysDifference >= 2) {
        return { message: "Cannot delete SubscribedUser after 2 days of last update" };
      }
    
      const SubscribedUserResult = await SubscribedUserModel.findOneAndUpdate(
        { _id: SubscribedUserInputs._id },
        { isDeleted: true },
        { new: true }
      );
  
      if (SubscribedUserResult) {
        await UsersModel.findByIdAndUpdate(SubscribedUserResult?.userId, { isSubscribed: false }, { new: true });
        return { message: "SubscribedUser Deleted" };
      }
  
      return false;
    } catch (err: any) {
      console.error("Error", err);
      throw new Error("Unable to Delete SubscribedUser");
    }
  }
}

export default SubscribedUserRepository;
