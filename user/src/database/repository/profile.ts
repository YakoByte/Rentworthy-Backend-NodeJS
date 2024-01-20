import { profileModel, historyModel } from "../models";
import { profileRequest, getProfileRequest } from "../../interface/profile";
import { Types } from "mongoose";

class profileRepository {
  async CreateProfile(profileInputs: profileRequest) {
    try {
      const findProfile = await profileModel.findOne({
        userId: profileInputs.userId,
      });
      console.log("findProfile", findProfile);
      if (findProfile) {
        const profile = await profileModel.findOneAndUpdate(
          {
            userId: profileInputs.userId,
            isDeleted: false,
            isBlocked: false,
          },
          profileInputs,
          { new: true }
        );
        return profile;
      }

      const profile = new profileModel(profileInputs);
      const profileResult = await profile.save();

      const history = new historyModel({
        profileId: profileResult._id,
        log: [
          {
            objectId: profileResult._id,
            action: `profile = ${profileInputs.userId} created`,
            date: new Date().toISOString(),
            time: Date.now(),
          },
        ],
      });
      await history.save();

      return profileResult;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to Create Profile");
    }
  }

  //get all profile active or inactive blocked or unblocked
  async getAllProfile(profileInputs: getProfileRequest) {
    try {
      const findProfile = await profileModel.aggregate([
        {
          $match: { ...profileInputs, isDeleted: false, isBlocked: false },
        },
        {
          $lookup: {
            from: "locations",
            localField: "locationId",
            foreignField: "_id",
            as: "locationId",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userId",
          },
        },
        {
          $lookup: {
            from: "images",
            localField: "profileImage",
            foreignField: "_id",
            as: "profileImage",
          },
        },
      ]);

      console.log("findProfile", findProfile);

      return findProfile;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to get AllProfile");
    }
  }

  async getProfileById(profileInputs: profileRequest) {
    try {
      const findProfile = await profileModel.aggregate([
        {
          $match: {
            userId: new Types.ObjectId(profileInputs.userId),
            isDeleted: false,
            isBlocked: false,
          },
        },
        {
          $lookup: {
            from: "locations",
            localField: "locationId",
            foreignField: "_id",
            as: "locationId",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userId",
          },
        },
        {
          $lookup: {
            from: "images",
            localField: "profileImage",
            foreignField: "_id",
            as: "profileImage",
          },
        },
      ]);

      console.log("findProfile", findProfile);
      
      return findProfile;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to get Profile By ID");
    }
  }

  //update profile
  async updateProfileById(profileInputs: profileRequest) {
    try {
      const findProfile = await profileModel.findOne({
        userId: profileInputs.userId,
        isDeleted: false,
        isBlocked: false,
      });

      if (!findProfile) {
        //create new profile
        let profile = new profileModel(profileInputs);
        profile = await profile.save();
        return profile;
      }

      console.log("findProfile", findProfile);

      const profile = await profileModel.findOneAndUpdate(
        {
          userId: profileInputs.userId,
          isDeleted: false,
          isBlocked: false,
        },
        profileInputs,
        { new: true }
      );

      return profile;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to update Profile By ID");
    }
  }

  //update level and points
  async updateLevel(profileInputs: profileRequest) {
    try {
      const findProfile = await profileModel.findOne({
        userId: profileInputs.userId,
        isDeleted: false,
        isBlocked: false,
      });

      if (!findProfile) {
        return false;
      }

      console.log("findProfile", findProfile);

      const profile: any = await profileModel.findOneAndUpdate(
        {
          userId: profileInputs.userId,
          isDeleted: false,
          isBlocked: false,
        },
        { $inc: { points: 1 } },
        { new: true }
      );

      if (profile.points >= 3000 && profile.level < 2) {
        profile.level = 2;
      }

      if (profile.points >= 6000 && profile.level < 3) {
        profile.level = 3;
      }

      await profile.save();

      return profile;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to update level");
    }
  }

  //delete profile
  async deleteProfileById(profileInputs: profileRequest) {
    try {
      const findProfile = await profileModel.findOne({
        userId: profileInputs.userId,
        isDeleted: false,
        isBlocked: false,
      });
      console.log("findProfile", findProfile);
      //if profile exist
      if (findProfile) {
        await profileModel.findOneAndUpdate(
          {
            userId: profileInputs.userId,
            isDeleted: false,
            isBlocked: false,
          },
          { isDeleted: true },
          { new: true }
        );

        return true;
      }
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to delete Profile By ID");
    }
  }
}

export default profileRepository;
