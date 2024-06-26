import { profileModel, historyModel, userModel } from "../models";
import { profileRequest, getProfileRequest } from "../../interface/profile";
import { Types } from "mongoose";
import { generatePresignedUrl } from "../../utils/aws";

class profileRepository {
  async CreateProfile(profileInputs: profileRequest) {
    try {
      const findProfile = await profileModel.findOne({
        userId: profileInputs.userId,
      });

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
  async getAllProfile({skip, limit}: { skip: number; limit: number; }) {
    try {    
      const findProfile = await profileModel.aggregate([
        { $skip: skip },
        { $limit: limit },
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


      await Promise.all(
        findProfile.map(async (profile: any) => {
          await Promise.all(
            profile.profileImage.map(async (element: any) => {
              const newPath = await generatePresignedUrl(element.imageName);
              element.path = newPath;
            })
          );
        })
      );

      const countProfile = await profileModel.countDocuments();

      return {findProfile, countProfile};
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to get AllProfile");
    }
  }

  async getAllBlockedProfile({skip, limit}: { skip: number; limit: number; }) {
    try {    
      const findProfile = await profileModel.aggregate([
        { $match: { isBlocked: true } },
        { $skip: skip },
        { $limit: limit },
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


      await Promise.all(
        findProfile.map(async (profile: any) => {
          await Promise.all(
            profile.profileImage.map(async (element: any) => {
              const newPath = await generatePresignedUrl(element.imageName);
              element.path = newPath;
            })
          );
        })
      );

      const countProfile = await profileModel.countDocuments({ isBlocked: true});

      return {findProfile, countProfile};
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to get AllProfile");
    }
  }

  async getAllDeletedProfile({skip, limit}: { skip: number; limit: number; }) {
    try {    
      const findProfile = await profileModel.aggregate([
        { $match: { isDeleted: true } },
        { $skip: skip },
        { $limit: limit },
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


      await Promise.all(
        findProfile.map(async (profile: any) => {
          await Promise.all(
            profile.profileImage.map(async (element: any) => {
              const newPath = await generatePresignedUrl(element.imageName);
              element.path = newPath;
            })
          );
        })
      );

      const countProfile = await profileModel.countDocuments({ isDeleted: true });

      return {findProfile, countProfile};
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to get AllProfile");
    }
  }

  async getAllActiveProfile({skip, limit}: { skip: number; limit: number; }) {
    try {    
      const findProfile = await profileModel.aggregate([
        { $match: { isActive: true } },
        { $skip: skip },
        { $limit: limit },
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


      await Promise.all(
        findProfile.map(async (profile: any) => {
          await Promise.all(
            profile.profileImage.map(async (element: any) => {
              const newPath = await generatePresignedUrl(element.imageName);
              element.path = newPath;
            })
          );
        })
      );

      const countProfile = await profileModel.countDocuments({ isActive: true });

      return {findProfile, countProfile};
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to get AllProfile");
    }
  }

  async getProfileByUserId(profileInputs: getProfileRequest) {
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

      await Promise.all(
        findProfile.map(async (profile: any) => {
          await Promise.all(
            profile.profileImage.map(async (element: any) => {
              const newPath = await generatePresignedUrl(element.imageName);
              element.path = newPath;
            })
          );
        })
      );
            
      return findProfile;
    } catch (error) {
      console.log("error", error);
      throw new Error("Unable to get Profile By ID");
    }
  }

  async getProfileById(profileInputs: getProfileRequest) {
    try {      
      const findProfile = await profileModel.aggregate([
        {
          $match: {
            _id: new Types.ObjectId(profileInputs._id),
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

      await Promise.all(
        findProfile.map(async (profile: any) => {
          await Promise.all(
            profile.profileImage.map(async (element: any) => {
              const newPath = await generatePresignedUrl(element.imageName);
              element.path = newPath;
            })
          );
        })
      );
            
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
        let profile = new profileModel(profileInputs);
        profile = await profile.save();
        return profile;
      }

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

      if(profileInputs.level && findProfile.level === 5 && profileInputs.level + findProfile.level > 5) {
        return findProfile
      }

      if(profileInputs.points && findProfile.points > 10000 && profileInputs.points + findProfile.points > 10000) {
        return findProfile
      }

      let profile;

      if(profileInputs.points){
        profile = await profileModel.findOneAndUpdate(
          {
            userId: profileInputs.userId,
            isDeleted: false,
            isBlocked: false,
          },
          { points: profileInputs.points  + findProfile.points},
          { new: true }
        );

        if (!profile) {
          return false;
        }
  
        if (profile.points >= 2500 && profile.level < 2) {
          profile.level = 2;
        }

        if (profile.points >= 5000 && profile.level < 3) {
          profile.level = 3;
        }
  
        if (profile.points >= 7500 && profile.level < 4) {
          profile.level = 4;
        }

        if (profile.points >= 10000 && profile.level < 5) {
          profile.level = 5;
        }
  
        await profile.save();
      } else if (profileInputs.level) {
        profile = await profileModel.findOneAndUpdate(
          {
            userId: profileInputs.userId,
            isDeleted: false,
            isBlocked: false,
          },
          { level: profileInputs.level },
          { new: true }
        );
      }

      if(!profile) {
        return false
      }

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

  async updateUserView(userInput: {_id: string}) {
    try {
        await userModel.updateOne(
          { _id: userInput._id },
          { $inc: { views: 1 } }
        );

        return true;
    } catch (error) {
      console.log("Error: ", error);
    }
  }
}

export default profileRepository;
