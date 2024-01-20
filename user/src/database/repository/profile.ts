import { profileModel, historyModel } from "../models";
import {
    FormateData,
    // GeneratePassword,
    // GenerateSalt,
    // GenerateSignature,
    // ValidatePassword,
} from '../../utils';
import {
    APIError,
    BadRequestError,
    STATUS_CODES,
} from "../../utils/app-error";
import { profileRequest, getProfileRequest } from "../../interface/profile";
import { Types } from "mongoose";
class profileRepository {
    async CreateProfile(profileInputs: profileRequest) {
        // try {
        const findProfile = await profileModel.findOne({ userId: profileInputs.userId });
        console.log("findProfile", findProfile)
        if (findProfile) {
            const profile = await profileModel
                .findOneAndUpdate(
                    {
                        userId: profileInputs.userId,
                        isDeleted: false,
                        isBlocked: false
                    },
                    profileInputs,
                    { new: true }
                );
            return FormateData(profile);
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
    }

    //get all profile active or inactive blocked or unblocked
    async getAllProfile(profileInputs: getProfileRequest) {
        const findProfile = await profileModel.aggregate([
            {
                $match: { ...profileInputs, isDeleted: false, isBlocked: false }
            },
            {
                $lookup: {
                    from: "locations",
                    localField: "locationId",
                    foreignField: "_id",
                    as: "locationId"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userId"
                }
            },
            {
                $lookup: {
                    from: "images",
                    localField: "profileImage",
                    foreignField: "_id",
                    as: "profileImage"
                }
            }
        ])
        console.log("findProfile", findProfile)
        if (findProfile) {
            return findProfile;
        }
    }

    async getProfileById(profileInputs: profileRequest) {
        // const findProfile = await profileModel.findOne({ userId: profileInputs.userId, isDeleted: false, isBlocked: false, })
        //     .populate([{ path: "userId", select: "userName email phoneNo bussinessType" }, { path: "locationId", select: "location" }]);
        const findProfile = await profileModel.aggregate([
            {
                // $match: { userId: profileInputs.userId, isDeleted: false, isBlocked: false }
                $match: { userId: new Types.ObjectId(profileInputs.userId), isDeleted: false, isBlocked: false }
            },
            {
                $lookup: {
                    from: "locations",
                    localField: "locationId",
                    foreignField: "_id",
                    as: "locationId"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userId"
                }
            },
            {
                $lookup: {
                    from: "images",
                    localField: "profileImage",
                    foreignField: "_id",
                    as: "profileImage"
                }
            }
        ])

        console.log("findProfile", findProfile)
        if (findProfile) {
            return findProfile;
        }
    }

    //update profile
    async updateProfileById(profileInputs: profileRequest) {
        const findProfile = await profileModel.findOne({ userId: profileInputs.userId, isDeleted: false, isBlocked: false });
        if (!findProfile) {
            //create new profile
            const profile = new profileModel(profileInputs);
            const profileResult = await profile.save();
            return FormateData(profileResult);
        }
        console.log("findProfile", findProfile)
        //if profile exist
        if (findProfile) {
            const profile = await profileModel
                .findOneAndUpdate(
                    {
                        userId: profileInputs.userId,
                        isDeleted: false,
                        isBlocked: false
                    },
                    profileInputs,
                    { new: true }
                );
            return FormateData({ message: "profile updated successfully" });
        }

    }

    //update level and points

    async updateLevel(profileInputs: profileRequest) {
        const findProfile = await profileModel.findOne({ userId: profileInputs.userId, isDeleted: false, isBlocked: false });
        if (!findProfile) {
            return FormateData({ message: "profile not found" });
        }
        console.log("findProfile", findProfile)
        //if profile exist
        if (findProfile) {
            const profile: any = await profileModel
                .findOneAndUpdate(
                    {
                        userId: profileInputs.userId,
                        isDeleted: false,
                        isBlocked: false
                    },
                    { $inc: { points: 1 } },
                    { new: true }
                );
            if (profile.points >= 3000) {
                await profileModel
                    .findOneAndUpdate(
                        {
                            userId: profileInputs.userId,
                            isDeleted: false,
                            isBlocked: false
                        },
                        { level: 2 },
                        { new: true }
                    );
            }
            if (profile.points >= 6000) {
                await profileModel
                    .findOneAndUpdate(
                        {
                            userId: profileInputs.userId,
                            isDeleted: false,
                            isBlocked: false
                        },
                        { level: 3 },
                        { new: true }
                    );
            }
            return FormateData({ message: "profile updated successfully" });
        }

    }


    //delete profile
    async deleteProfileById(profileInputs: profileRequest) {
        const findProfile = await profileModel.findOne({ userId: profileInputs.userId, isDeleted: false, isBlocked: false });
        console.log("findProfile", findProfile)
        //if profile exist
        if (findProfile) {
            const profile = await profileModel
                .findOneAndUpdate(
                    {
                        userId: profileInputs.userId,
                        isDeleted: false,
                        isBlocked: false
                    },
                    { isDeleted: true },
                    { new: true }
                );
            return FormateData({ message: "profile deleted successfully" });
        }
    }

}

export default profileRepository;
